# WORKFLOW: Client Lifecycle Management

**Purpose:** End-to-end workflow managing the complete client journey from initial brief to project handoff and retention.

**Trigger:** New client brief received or new project initiated.

## PHASE 1: ACQUISITION (Brief → Contract)
1. **Brief Intake**: Receive and parse client brief. Invoke `client_onboarding_automation` skill.
2. **Analysis**: Run competitor and market analysis using `competitor_intelligence` + `seo_serp_competitor`.
3. **Proposal**: Invoke `proposal_generator` skill to draft proposal with C.B.O methodology.
4. **Presentation**: Format proposal for presentation. Invoke `slides` skill if needed.
5. **Negotiation**: Revise proposal based on client feedback. Finalize scope and pricing.
6. **Contract**: Sign contract and trigger onboarding.

## PHASE 2: ONBOARDING (Contract → Kickoff)
1. **Workspace Setup**: Create `3_MEMORY/projects/{client_name}/` with standard folder structure.
2. **Access Setup**: Obtain GSC, GA4, CMS credentials. Store securely.
3. **Baseline Audit**: Run full SEO audit using `claude_seo_framework` 5-phase sequence.
4. **KPI Definition**: Establish measurable KPIs based on service type.
5. **Timeline**: Create project timeline with milestones.
6. **Kickoff Meeting**: Present strategy and timeline to client.

## PHASE 3: EXECUTION (Kickoff → Delivery)
1. **Sprint Planning**: Break work into 2-week sprints (see `sprint_planning_workflow`).
2. **Content Pipeline**: Generate content calendar. Execute `content_review_sop` for each piece.
3. **Technical SEO**: Implement fixes from baseline audit. Run `deployment_checklist_sop` for each change.
4. **Reporting**: Generate weekly flash reports and monthly full reports (`seo_reporting_sop`).
5. **QA**: Run `qa_review_workflow` before each major delivery.

## PHASE 4: HANDOFF & RETENTION (Delivery → Renewal)
1. **Project Completion**: Execute `client_handoff_sop`.
2. **Satisfaction Survey**: Collect feedback. Identify upsell opportunities.
3. **Retention**: For retainer clients, transition to `monthly_retainer_workflow`.
4. **Archive**: Move completed project to archived status.
