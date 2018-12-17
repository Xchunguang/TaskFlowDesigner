package com.xuchg.service;

import java.util.List;

import com.xuchg.dto.TaskFlowModel;
import com.xuchg.vo.TaskFlowVO;

/**
 * 任务流服务
 * @author xuchg1
 */
public interface TaskFlowService {

    /**
     * 根据任务流模型保存任务流
     * @param model
     */
    String saveTaskFlow(TaskFlowModel model);

    /**
     * 根据任务流主键查找组织任务流模型
     * @param taskFlowPk
     * @return
     */
    TaskFlowModel getTaskFlowModel(String taskFlowPk);

    /**
     * 获得所有的任务流VO
     * @return
     */
    List<TaskFlowVO> getAllTaskFlow();

    /**
     * 删除任务流
     * @param taskFlowPk
     */
    void deleteTaskFlow(String taskFlowPk);


}
