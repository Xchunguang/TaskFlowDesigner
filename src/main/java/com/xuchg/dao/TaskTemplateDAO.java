package com.xuchg.dao;

import java.util.List;

import com.xuchg.base.dao.BaseDAO;
import com.xuchg.vo.TaskTemplateVO;

/**
 * @author xuchg1
 */
public interface TaskTemplateDAO extends BaseDAO<TaskTemplateVO> {

    /**
     * 删除任务流下的所有模板
     * @param taskFlowPk
     */
    void deleteByTaskFlowPk(String taskFlowPk);

    /**
     * 查找任务流的任务模板
     * @param taskFlowPk
     */
    List<TaskTemplateVO> findByTaskFlowPk(String taskFlowPk);
}
