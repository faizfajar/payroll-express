const { AuditLog } = require("../models");

module.exports = async function logAudit({
  table,
  record_id,
  action,
  user_id,
  request_id,
  ip_address
}) {
  await AuditLog.create({
    table_name: table,
    record_id,
    action,
    performed_by: user_id,
    request_id,
    ip_address
  });
};
