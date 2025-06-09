const {
  PayrollPeriod,
  PayrollPeriodEmployee,
  Attendance,
  Overtime,
  Reimbursement,
  Employee,
  Payroll,
} = require("../models");
const { Op } = require("sequelize");
const response = require("../helpers/response");
const dayjs = require("dayjs");
const durationPlugin = require("dayjs/plugin/duration");
dayjs.extend(durationPlugin);

const runPayroll = async (req, res) => {
  try {
    const { ppr_id } = req.body;

    if (!ppr_id) {
      return response.validationError(res, "Payroll period ID is required");
    }

    // check payroll period already runned
    const payrollPeriod = await PayrollPeriod.findByPk(ppr_id);
    if (!payrollPeriod)
      return response.notFound(res, "Payroll period not found");
    if (payrollPeriod.is_processed == true) {
      return response.validationError(
        res,
        "Payroll for this period has already been processed"
      );
    }

    const { start_date, finish_date } = payrollPeriod;

    // get mapped employee on period
    const mappedEmployees = await PayrollPeriodEmployee.findAll({
      where: { ppr_id },
      include: [{ model: Employee, as: "employee" }],
    });

    const payslipData = [];

    for (const mapping of mappedEmployees) {
      const emp_id = mapping.emp_id;
      const employee = mapping.employee;

      // calculate attendance
      const attendances = await Attendance.findAll({
        where: {
          emp_id,
          attendance_date: {
            [Op.between]: [start_date, finish_date],
          },
        },
      });

      const daysPresent = attendances.length;
      console.log(daysPresent, "empId", emp_id);

      // count overtime hours
      const overtimes = await Overtime.findAll({
        where: {
          emp_id,
          overtime_date: {
            [Op.between]: [start_date, finish_date],
          },
        },
      });

      let totalMinutes = 0;
      for (const ot of overtimes) {
        if (typeof ot.duration === "string") {
          const [hours, minutes, seconds] = ot.duration.split(":").map(Number);
          const durationInMinutes = hours * 60 + minutes + seconds / 60;
          totalMinutes += durationInMinutes;
        } else {
          console.warn(`Invalid duration for emp_id ${emp_id}:`, ot.duration);
        }
      }
      const totalOvertimeHours = totalMinutes / 60;
      console.log(`Emp_id ${emp_id} totalOvertimeHours:`, totalOvertimeHours);

      // count reimburse
      const totalReimbursement =
        (await Reimbursement.sum("ammount", {
          where: {
            emp_id,
            reimbursement_date: {
              [Op.between]: [start_date, finish_date],
            },
          },
        })) || 0;

      // count salary prorate
      const baseSalary = employee?.salary ?? 0;
      const workingDays = 5 * 4; // asumsi 5 hari kerja x 4 minggu = 20 hari
      const dailySalary = workingDays > 0 ? baseSalary / workingDays : 0;
      const attendancePay = daysPresent > 0 ? dailySalary * daysPresent : 0;
      const overtimePay =
        totalOvertimeHours > 0 ? dailySalary * 2 * totalOvertimeHours : 0;
      const totalTakeHome = Math.round(
        attendancePay + overtimePay + totalReimbursement
      );

      // insert payslip
      const payslip = await Payroll.create({
        emp_id,
        ppr_id,
        days_present: daysPresent,
        total_overtime_hours: totalOvertimeHours,
        total_reimbursement: totalReimbursement,
        base_salary: baseSalary,
        total_salary: totalTakeHome,
        breakdown: {
          attendancePay,
          overtimePay,
          reimbursement: totalReimbursement,
        },
      });

      payslipData.push(payslip);
    }

    // Update status payroll_period to "processed / true"
    payrollPeriod.is_processed = true;
    await payrollPeriod.save();

    return response.success(res, "Payroll run successfully", payslipData);
  } catch (err) {
    console.error(err);
    return response.error(res, "Failed to run payroll");
  }
};

const generatePayslip = async (req, res) => {
  try {
    const { ppr_id } = req.params;
    const emp_id = req.user.emp_id; // get emp_id by token user login

    const payrollPeriod = await PayrollPeriod.findByPk(ppr_id);
    if (!payrollPeriod)
      return response.notFound(res, "Payroll period not found");

    if (!payrollPeriod.is_processed)
      return response.validationError(
        res,
        "Payroll has not been processed yet"
      );

    const payslip = await Payroll.findOne({
      where: { ppr_id, emp_id },
    });

    if (!payslip) {
      return response.notFound(res, "Payslip not found for this period");
    }

    return response.success(res, "Payslip fetched", {
      base_salary: payslip.base_salary,
      days_present: payslip.days_present,
      total_overtime_hours: payslip.total_overtime_hours,
      total_reimbursement: payslip.total_reimbursement,
      total_salary: payslip.total_salary,
      breakdown: payslip.breakdown,
    });
  } catch (err) {
    console.error(err);
    return response.error(res, "Failed to get payslip");
  }
};

const getPayrollSummary = async (req, res) => {
  try {
    const { ppr_id } = req.params;

    const period = await PayrollPeriod.findByPk(ppr_id);
    if (!period) return response.notFound(res, "Payroll period not found");
    if (!period.is_processed)
      return response.validationError(res, "Payroll not yet processed");

    const payslips = await Payroll.findAll({
      where: { ppr_id },
      include: [{ model: Employee, as: "employee"}],
    });

    const summary = payslips.map((p) => ({
      emp_id: p.emp_id,
      name: p.employee?.employee_first_name + " " + p.employee?.employee_last_name ?? "-",
      total_salary: p.total_salary,
    }));

    const totalPayroll = payslips.reduce(
      (acc, p) => acc + Number(p.total_salary),
      0
    );

    return response.success(res, "Payroll summary fetched", {
      period: {
        ppr_id,
        start_date: period.start_date,
        finish_date: period.finish_date,
      },
      summary,
      total_take_home_all_employee: totalPayroll,
    });
  } catch (err) {
    console.error(err);
    return response.error(res, "Failed to fetch payroll summary");
  }
};

module.exports = {
  runPayroll,
  generatePayslip,
  getPayrollSummary
};
