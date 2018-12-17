package com.xuchg.service.imp;

import java.util.List;

import javax.transaction.Transactional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.xuchg.dao.TaskFlowDAO;
import com.xuchg.dao.TaskTempRelationDAO;
import com.xuchg.dao.TaskTemplateDAO;
import com.xuchg.dto.TaskFlowModel;
import com.xuchg.service.TaskFlowService;
import com.xuchg.vo.TaskFlowVO;
import com.xuchg.vo.TaskTempRelationVO;
import com.xuchg.vo.TaskTemplateVO;

@Service
public class TaskFlowServiceImp implements TaskFlowService {
    @Autowired
    private TaskFlowDAO taskFlowDAO;
    @Autowired
    private TaskTemplateDAO taskTemplateDAO;
    @Autowired
    private TaskTempRelationDAO taskTempRelationDAO;



    @Override
    @Transactional
    public String saveTaskFlow(TaskFlowModel model) {
        TaskFlowVO taskFlowVO = new TaskFlowVO();
        taskFlowVO.setTaskFlowJson(model.getTaskFlowJson());
        taskFlowVO.setTaskFlowName(model.getTaskFlowName());
        if(StringUtils.isNotBlank(model.getTaskFlowPk())){
            taskFlowVO.setTaskFlowPk(model.getTaskFlowPk());
            taskFlowVO = taskFlowDAO.save(taskFlowVO);
            taskTemplateDAO.deleteByTaskFlowPk(model.getTaskFlowPk());
            taskTempRelationDAO.deleteByTaskFlowPk(model.getTaskFlowPk());
        }else{
        	taskFlowVO.setTaskFlowPk("");
            taskFlowDAO.save(taskFlowVO);
        }

        for (TaskTemplateVO taskTemplateVO : model.getTaskTempList()) {
            taskTemplateVO.setTaskFlowPk(taskFlowVO.getTaskFlowPk());
            if(StringUtils.isBlank(taskTemplateVO.getTaskTemplatePk())){
            	taskTemplateVO.setTaskTemplatePk("");
            }
        }
        for (TaskTempRelationVO taskTempRelationVO : model.getTaskTempRelationList()) {
            taskTempRelationVO.setTaskFlowPk(taskFlowVO.getTaskFlowPk());
            if(StringUtils.isBlank(taskTempRelationVO.getTaskTempRelationPk())){
            	taskTempRelationVO.setTaskTempRelationPk("");
            }
        }
        taskTemplateDAO.saveAll(model.getTaskTempList());
        taskTempRelationDAO.saveAll(model.getTaskTempRelationList());
        return taskFlowVO.getTaskFlowPk();
    }

    @Override
    public TaskFlowModel getTaskFlowModel(String taskFlowPk) {
        TaskFlowModel model = new TaskFlowModel();
        TaskFlowVO taskFlowVO = taskFlowDAO.findById(taskFlowPk).orElse(null);
        if(taskFlowVO != null){
            List<TaskTemplateVO> tempList = taskTemplateDAO.findByTaskFlowPk(taskFlowPk);
            List<TaskTempRelationVO> tempRelationList = taskTempRelationDAO.findByTaskFlowPk(taskFlowPk);
            model.setTaskFlowJson(taskFlowVO.getTaskFlowJson());
            model.setTaskFlowName(taskFlowVO.getTaskFlowName());
            model.setTaskFlowPk(taskFlowPk);
            model.setTaskTempList(tempList);
            model.setTaskTempRelationList(tempRelationList);
        }
        return model;
    }

    @Override
    public List<TaskFlowVO> getAllTaskFlow() {
        List<TaskFlowVO> list = taskFlowDAO.findAll();
        return list;
    }

    @Override
    @Transactional
    public void deleteTaskFlow(String taskFlowPk) {
        taskTempRelationDAO.deleteByTaskFlowPk(taskFlowPk);
        taskTemplateDAO.deleteByTaskFlowPk(taskFlowPk);
        taskFlowDAO.deleteById(taskFlowPk);
    }
}
