package com.xuchg.vo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.xuchg.base.vo.BaseVO;

import lombok.Getter;
import lombok.Setter;

/**
 * 任务流模板关系表
 * @author xuchg1
 *
 */
@Setter
@Getter
@Entity
@Table(name = "TS_TASK_TEMPLATE_RELATION")
public class TaskTempRelationVO extends BaseVO {

    @Id
    @Column(name = "PK_TASK_TEMPLATE_RELATION", unique = true, nullable = false)
    private String taskTempRelationPk;

    @Column(name = "PK_TASK_FLOW", length = 55)
    private String taskFlowPk;

    @Column(name = "FRONT_TASK_TYPE",length = 50)
    private String frontTaskType;

    @Column(name = "AFTER_TASK_TYPE",length = 50)
    private String afterTaskType;

    @Column(name = "RESOLVE_TYPE",length = 50)
    private String resolveType;

    @Column(name = "RELATION_TYPE",length = 50)
    private String relationType;

}
