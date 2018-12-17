package com.xuchg.dto;

import java.util.ArrayList;
import java.util.List;

import com.xuchg.vo.TaskTempRelationVO;
import com.xuchg.vo.TaskTemplateVO;

import lombok.Getter;
import lombok.Setter;

/**
 * 任务流模板模型
 * @author xuchg1
 */
@Getter
@Setter
public class TaskFlowModel {
    private String taskFlowPk;

    private String taskFlowName;

    private List<TaskTemplateVO> taskTempList = new ArrayList<>();

    private List<TaskTempRelationVO> taskTempRelationList = new ArrayList<>();

    private String taskFlowJson;

}
