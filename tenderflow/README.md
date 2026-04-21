<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run the TenderFlow frontend

This frontend now talks to the local TenderFlow backend API.

## Run Locally

**Prerequisites:** Node.js and the backend running on `http://localhost:4000` by default.


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` if you want to override the backend URL
3. Run the app:
   `npm run dev`

## Local full-stack development

1. Start the backend from [backend/README.md](/mnt/d/project/AAPersonalInnovation/AITenderingCollaborationPlatform/backend/README.md)
2. Start this frontend with `npm run dev`
3. Open `http://localhost:3000`

The frontend repository implementation lives in [tenderFlowApiRepository.ts](/mnt/d/project/AAPersonalInnovation/AITenderingCollaborationPlatform/tenderflow/src/services/tenderFlowApiRepository.ts).
