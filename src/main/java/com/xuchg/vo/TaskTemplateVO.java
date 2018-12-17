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
 * 任务流模板表
 * @author xuchg1
 *
 */
@Setter
@Getter
@Entity
@Table(name = "TS_TASK_TEMPLATE")
public class TaskTemplateVO extends BaseVO {

    @Id
    @Column(name = "PK_TASK_TEMPLATE", unique = true, nullable = false)
    private String taskTemplatePk;

    @Column(name = "PK_TASK_FLOW", length = 55)
    private String taskFlowPk;

    @Column(name = "TEMPLATE_TYPE", length = 36)
    private String tempType;

    @Column(name = "CONTENT",length=10000)
    private String content;
}
