package com.xuchg.dao;

import java.util.List;

import com.xuchg.base.dao.BaseDAO;
import com.xuchg.vo.TaskTempRelationVO;

/**
 * 任务流模板关联关系
 * @author xuchg1
 */
public interface TaskTempRelationDAO extends BaseDAO<TaskTempRelationVO> {


    /**
     * 删除任务流下的所有关系
     * @param taskFlowPk
     */
    void deleteByTaskFlowPk(String taskFlowPk);

    /**
     * 查找任务流的模板关联关系
     * @param taskFlowPk
     * @return
     */
    List<TaskTempRelationVO> findByTaskFlowPk(String taskFlowPk);

}
