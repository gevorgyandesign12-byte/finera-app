# Finera App — Project Rules

## Project philosophy

Finera must be an independent accounting application, not a project locked inside Paperclip or any other coding agent.

The main architecture, logic, and product decisions are controlled by the product owner and ChatGPT.  
Paperclip or another coding agent may be used later only as an assistant for small, clearly defined tasks.

## Current phase

Current phase: SAFE frontend/demo skeleton only.

Allowed in this phase:
- Next.js + TypeScript frontend
- Demo/fake login
- Role-based demo views
- Placeholder menus and pages
- Fake/demo data only
- Documentation

Not allowed in this phase:
- Real database
- Real accounting data
- Production deployment
- Secrets, passwords, API keys
- Complex backend logic
- Paperclip dependency
- Risky automation

## Domain structure

- finera.am / www.finera.am — public website
- app.finera.am — main accounting web app
- api.finera.am — backend / API

The public website and the accounting app must remain separate projects.

## Future architecture requirement

Finera must support approximately 200+ client organizations.

There must be:
1. One central/master database for:
   - users
   - roles
   - permissions
   - organizations / tenant registry
   - user-organization access
   - system settings
   - Armenian chart of accounts template
   - global/reference data

2. One separate tenant database per client organization for that organization’s accounting data.

Finera must be one application that can work with many separate organization databases.  
It must not become 200 separate programs.

In the future, adding a new organization should be able to create a separate tenant database and register it in the master registry.

This is only an architecture requirement now. No real database is created in the current phase.

## Demo roles

1. Managers / Controllers
2. Chief accountants
3. Bookkeepers
4. Client organization / Partner dashboard
5. HR / Legal department
6. Support / Service department
7. Technical / Programmer team

## Safety rules

Do not add or change without explicit human approval:
- database migrations
- production deployment
- data deletion
- permissions/security logic
- accounting/tax logic
- secrets/passwords/API keys
- real accounting data processing
- Git main branch push for risky changes
- releases

Every step must be small, understandable, and reviewable.

## Safety and backup policy

Finera-ի production և real accounting անվտանգության հիմնական կանոնները առանձին գրանցված են այստեղ՝

- docs/SAFETY_AND_BACKUP_POLICY.md
