import {PrismaClient, AuditActorType, AssetType, BidDocumentStatus, ExportJobStatus, MatchStatus, ProjectStatus, RequirementStatus, RiskImpact, RiskStatus, UserRole, WorkflowStage} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.exportCheck.deleteMany();
  await prisma.exportJob.deleteMany();
  await prisma.evidenceMatch.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.riskItem.deleteMany();
  await prisma.complianceItem.deleteMany();
  await prisma.requirement.deleteMany();
  await prisma.bidDocument.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.projectBlocker.deleteMany();
  await prisma.projectKeyFact.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const organization = await prisma.organization.create({
    data: {
      name: 'TenderFlow Demo Org',
      industry: 'IT Infrastructure',
      slug: 'tenderflow-demo',
    },
  });

  const users = await prisma.$transaction([
    prisma.user.create({
      data: {organizationId: organization.id, name: '张经理', email: 'zhang.manager@demo.local', role: UserRole.BID_MANAGER},
    }),
    prisma.user.create({
      data: {organizationId: organization.id, name: '李工', email: 'li.engineer@demo.local', role: UserRole.REVIEWER},
    }),
    prisma.user.create({
      data: {organizationId: organization.id, name: '陈工', email: 'chen.engineer@demo.local', role: UserRole.REVIEWER},
    }),
  ]);

  const owner = users[0];

  const project = await prisma.project.create({
    data: {
      organizationId: organization.id,
      ownerId: owner.id,
      code: '招标文件-2026-001',
      title: '智慧城市基础设施建设 - 二期工程',
      issuer: 'XX市大数据管理局',
      deadline: new Date('2026-05-15T00:00:00.000Z'),
      status: ProjectStatus.COMPLIANCE_CHECK,
      valueDisplay: '￥25,000,000',
      riskScore: 35,
      category: 'IT Infrastructure',
      stage: WorkflowStage.COMPLIANCE,
      completeness: 68,
      nextAction: '补充安全生产许可证复核记录，并确认原厂授权函提交路径。',
      executiveSummary:
        '该项目属于高价值智慧城市基础设施建设，资格条件明确但废标红线较多。当前企业基础资质满足要求，主要缺口集中在高级职称人员配置与原厂授权函确认。',
      suggestedStrategy:
        '优先处理废标条款和人员证据缺口，再进入技术方案撰写。商务报价建议保留风险缓冲，并对履约保证金使用保函方案。',
      parseConfidence: 0.89,
      extractedAt: new Date('2026-04-21T10:45:00.000Z'),
      sourceDocumentName: '智慧城市基础设施二期_招标文件.pdf',
      sourceDocumentPages: 186,
      sourceDocumentVersion: 'v1.0',
    },
  });

  await prisma.project.createMany({
    data: [
      {
        organizationId: organization.id,
        ownerId: users[1].id,
        code: '招标-2026-042',
        title: '分布式云存储解决方案采购',
        issuer: '省测绘地理信息局',
        deadline: new Date('2026-05-20T00:00:00.000Z'),
        status: ProjectStatus.ANALYSIS,
        valueDisplay: '￥8,500,000',
        riskScore: 62,
        category: 'Cloud Services',
        stage: WorkflowStage.ANALYSIS,
        completeness: 24,
        nextAction: '等待文档结构化解析完成后生成资料清单。',
      },
      {
        organizationId: organization.id,
        ownerId: users[2].id,
        code: 'POLICE-2026-109',
        title: 'AI赋能智慧安防集成系统',
        issuer: '市公安局指挥中心',
        deadline: new Date('2026-06-01T00:00:00.000Z'),
        status: ProjectStatus.FINAL_AUDIT,
        valueDisplay: '￥12,300,000',
        riskScore: 15,
        category: 'AI Security',
        stage: WorkflowStage.AUDIT,
        completeness: 92,
        nextAction: '等待负责人完成最终递交预审。',
      },
    ],
  });

  await prisma.projectBlocker.createMany({
    data: [
      {projectId: project.id, title: '安全生产许可证扫描件待复核', severity: RiskImpact.HIGH, owner: '李工', status: 'active'},
      {projectId: project.id, title: '技术响应偏离表剩余 2 项未确认', severity: RiskImpact.MEDIUM, owner: '陈工', status: 'active'},
    ],
  });

  await prisma.auditLog.createMany({
    data: [
      {projectId: project.id, userId: null, actor: 'AI Assistant', action: '提取 18 条核心资格与废标要求', actorType: AuditActorType.AI, occurredAt: new Date('2026-04-21T10:15:00.000Z')},
      {projectId: project.id, userId: owner.id, actor: '张经理', action: '将项目推进至合规审查', actorType: AuditActorType.USER, occurredAt: new Date('2026-04-20T16:32:00.000Z')},
      {projectId: project.id, userId: null, actor: 'System', action: '完成企业资质库初次对标', actorType: AuditActorType.SYSTEM, occurredAt: new Date('2026-04-20T14:00:00.000Z')},
    ],
  });

  await prisma.bidDocument.create({
    data: {
      projectId: project.id,
      name: '智慧城市基础设施二期_招标文件.pdf',
      version: 'v1.0',
      pageCount: 186,
      status: BidDocumentStatus.PARSED,
    },
  });

  const createdRequirements = await prisma.$transaction([
    prisma.requirement.create({
      data: {
        projectId: project.id,
        title: '一级专业承包资质',
        requirement: '投标人必须具备电子与智能化工程专业承包一级资质，且证书在有效期内。',
        status: RequirementStatus.MET,
        priority: RiskImpact.HIGH,
        sourceText: '投标人需具备一级资质，证书必须真实有效，并提供原件扫描件。',
        sourceDoc: '招标文件 P12',
        isHighRisk: true,
        confidence: 0.97,
      },
    }),
    prisma.requirement.create({
      data: {
        projectId: project.id,
        title: '近三年审计报告',
        requirement: '提供近三年经审计财务报告，年均营收不低于 5000 万。',
        status: RequirementStatus.MET,
        priority: RiskImpact.MEDIUM,
        sourceText: '投标人应提供经会计师事务所审计的财务报告。',
        sourceDoc: '商务要求 P4',
        isHighRisk: false,
        confidence: 0.91,
      },
    }),
    prisma.requirement.create({
      data: {
        projectId: project.id,
        title: '高级架构师配置',
        requirement: '核心技术团队需包含至少 2 名具备高级职称的系统架构师。',
        status: RequirementStatus.UNMET,
        priority: RiskImpact.HIGH,
        sourceText: '项目经理及架构师任职条件：必须具有正高级或高级工程师职称。',
        sourceDoc: '技术规范 P42',
        isHighRisk: true,
        confidence: 0.84,
      },
    }),
    prisma.requirement.create({
      data: {
        projectId: project.id,
        title: '原厂授权函',
        requirement: '承诺在中标后 24 小时内提供原厂授权函。',
        status: RequirementStatus.UNCERTAIN,
        priority: RiskImpact.HIGH,
        sourceText: '未提供原厂授权函视为实质性不响应招标文件要求，按废标处理。',
        sourceDoc: '通用条款 P5',
        isHighRisk: true,
        confidence: 0.79,
      },
    }),
  ]);

  await prisma.complianceItem.createMany({
    data: createdRequirements.map((requirement) => ({
      projectId: project.id,
      requirementId: requirement.id,
      title: requirement.title,
      requirement: requirement.requirement,
      status: requirement.status,
      priority: requirement.priority,
      sourceText: requirement.sourceText,
      sourceDoc: requirement.sourceDoc,
      isHighRisk: requirement.isHighRisk,
      confidence: requirement.confidence,
    })),
  });

  await prisma.riskItem.createMany({
    data: [
      {
        projectId: project.id,
        category: 'legal',
        factor: '原厂授权函被写入废标条款，提交路径与时限需要提前锁定。',
        impact: RiskImpact.HIGH,
        mitigation: '在澄清阶段确认授权函格式，同时提前向原厂发起授权流程。',
        affectedSection: '通用条款 P5',
        status: RiskStatus.OPEN,
        owner: '张经理',
      },
      {
        projectId: project.id,
        category: 'technical',
        factor: '高级架构师数量暂不满足技术团队最低配置。',
        impact: RiskImpact.HIGH,
        mitigation: '补充一名高级职称架构师，或调整联合投标人员配置。',
        affectedSection: '技术规范 P42',
        status: RiskStatus.OPEN,
        owner: '陈工',
      },
      {
        projectId: project.id,
        category: 'commercial',
        factor: '履约保证金占比偏高，可能造成短期现金流压力。',
        impact: RiskImpact.MEDIUM,
        mitigation: '优先申请银行履约保函替代现金保证金。',
        affectedSection: '商务要求 P18',
        status: RiskStatus.MITIGATED,
        owner: '钱工',
      },
    ],
  });

  const assets = await prisma.$transaction([
    prisma.asset.create({
      data: {
        organizationId: organization.id,
        name: '电子与智能化工程专业承包一级资质',
        type: AssetType.QUALIFICATION,
        evidence: '企业资质证书 #D234010203',
        expirationDate: new Date('2028-08-30T00:00:00.000Z'),
      },
    }),
    prisma.asset.create({
      data: {
        organizationId: organization.id,
        name: '2023-2025 审计报告',
        type: AssetType.FINANCIAL,
        evidence: '审计报告合并包.zip',
        expirationDate: new Date('2026-12-31T00:00:00.000Z'),
      },
    }),
  ]);

  await prisma.evidenceMatch.createMany({
    data: [
      {
        projectId: project.id,
        requirementId: createdRequirements[0].id,
        assetId: assets[0].id,
        name: '电子与智能化工程专业承包一级资质',
        type: AssetType.QUALIFICATION,
        status: MatchStatus.MATCHED,
        requiredBy: '资格预审 / 企业资质',
        evidence: '企业资质证书 #D234010203',
        expirationDate: new Date('2028-08-30T00:00:00.000Z'),
        confidence: 0.96,
        recommendation: '证书等级和有效期均满足要求，可进入人工确认。',
      },
      {
        projectId: project.id,
        requirementId: createdRequirements[2].id,
        assetId: null,
        name: '高级系统架构师证书 x2',
        type: AssetType.PERSONNEL,
        status: MatchStatus.MISSING,
        requiredBy: '技术响应方案 / 团队构成',
        confidence: 0.31,
        recommendation: '仅匹配到 1 名高级职称人员，需补充人员证明或调整团队配置。',
      },
      {
        projectId: project.id,
        requirementId: createdRequirements[1].id,
        assetId: assets[1].id,
        name: '2023-2025 审计报告',
        type: AssetType.FINANCIAL,
        status: MatchStatus.REVIEW,
        requiredBy: '商务部分 / 财务能力',
        evidence: '审计报告合并包.zip',
        expirationDate: new Date('2026-12-31T00:00:00.000Z'),
        confidence: 0.74,
        recommendation: '金额满足要求，但扫描件章页需人工确认。',
      },
    ],
  });

  const exportJob = await prisma.exportJob.create({
    data: {
      organizationId: organization.id,
      projectId: project.id,
      label: 'V2.2 - 预审定稿包',
      createdBy: '张经理',
      isCurrent: true,
      readiness: 84,
      status: ExportJobStatus.READY,
    },
  });

  await prisma.exportCheck.createMany({
    data: [
      {exportJobId: exportJob.id, label: '公司基础资质文件齐全', status: 'pass', owner: '李工'},
      {exportJobId: exportJob.id, label: '废标红线项完成二次复核', status: 'warning', owner: '张经理', message: '原厂授权函格式待确认'},
      {exportJobId: exportJob.id, label: '项目团队证书等级对标', status: 'fail', owner: '陈工', message: '缺少 1 名高级架构师证明'},
      {exportJobId: exportJob.id, label: '商务报价表字段完整', status: 'pass', owner: '钱工'},
    ],
  });

  await prisma.exportJob.createMany({
    data: [
      {organizationId: organization.id, projectId: project.id, label: 'V2.1 - 技术响应修订', createdBy: '陈工', isCurrent: false, status: ExportJobStatus.READY},
      {organizationId: organization.id, projectId: project.id, label: 'V1.0 - 初稿框架', createdBy: 'AI Assistant', isCurrent: false, status: ExportJobStatus.READY},
    ],
  });

  await prisma.projectKeyFact.createMany({
    data: [
      {projectId: project.id, label: '招标人', value: 'XX市大数据管理局'},
      {projectId: project.id, label: '预算金额', value: '￥25,000,000'},
      {projectId: project.id, label: '递交截止', value: '2026-05-15', tone: 'warning'},
      {projectId: project.id, label: '废标红线', value: '3 项', tone: 'danger'},
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
