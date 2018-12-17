package com.xuchg.vo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;

import com.xuchg.base.vo.BaseVO;

import lombok.Getter;
import lombok.Setter;

/**
 * 任务流表
 * @author xuchg1
 *
 */
@Setter
@Getter
@Entity
@Table(name = "TS_TASK_FLOW")
public class TaskFlowVO extends BaseVO {

    @Id
    @Column(name = "PK_TASK_FLOW", unique = true, nullable = false)
    private String taskFlowPk;

    @Column(name = "TASK_FLOW_NAME",length = 50)
    private String taskFlowName;

    @Column(name = "TASK_FLOW_JSON",length=10000)
    private String taskFlowJson;

}
