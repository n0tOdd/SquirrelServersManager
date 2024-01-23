import express from 'express';
import ansible from '../../shell/ansible';
import logger from '../../logger';
import AnsibleLogsRepo from '../../database/repository/AnsibleLogsRepo';
import AnsibleTaskStatusRepo from '../../database/repository/AnsibleTaskStatusRepo';

const router = express.Router();

router.post(`/exec/playbook`, async (req, res) => {
  if (!req.body.playbook) {
    res.status(400).send({
      success: false,
    });
    return;
  }
  try {
    logger.info(`[CONTROLLER][ANSIBLE] exec playbook ${req.body.playbook}`);
    const execId = await ansible.executePlaybook(req.body.playbook, req.body.target);
    res.send({
      success: true,
      data: { execId: execId },
    });
  } catch (err) {
    res.status(500).send({
      success: false,
    });
    return;
  }
});

router.get(`/exec/:id/logs`, async (req, res) => {
  if (!req.params.id) {
    res.status(400).send({
      success: false,
    });
    return;
  }
  logger.info(`[CONTROLLER][ANSIBLE] ExecLogs ${req.params.id}`);
  const execLogs = await AnsibleLogsRepo.findAllByIdent(req.params.id);
  logger.info(execLogs);
  res.send({
    success: true,
    data: {
      execId: req.params.id,
      execLogs: execLogs,
    },
  });
});

router.get(`/exec/:id/status`, async (req, res) => {
  if (!req.params.id) {
    res.status(400).send({
      success: false,
    });
    return;
  }
  logger.info(`[CONTROLLER][ANSIBLE] ExecLogs ${req.params.id}`);
  const taskStatuses = await AnsibleTaskStatusRepo.findAllByIdent(req.params.id);
  logger.info(taskStatuses);
  res.send({
    success: true,
    data: {
      execId: req.params.id,
      execStatuses: taskStatuses,
    },
  });
});

export default router;
