#!/usr/bin/env node
'use strict';
// CI mode accepts the GitHub secret only from FIREBASE_SA env. No credential values are printed.
const fs = require('node:fs');
const crypto = require('node:crypto');
const args = process.argv.slice(2);
const fileAt = args.indexOf('--file');
const local = fileAt >= 0;
const testing = args.includes('--self-test');
const redact = value => crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex').slice(0, 16);
function inspect(input, showLocalEmail = false) {
  let sa;
  try { sa = JSON.parse(input); }
  catch { throw new Error('서비스 계정 JSON 형식이 아닙니다.'); }
  if (!sa || sa.type !== 'service_account' || typeof sa.client_email !== 'string' ||
      !sa.client_email.includes('@') || typeof sa.project_id !== 'string' ||
      typeof sa.private_key !== 'string' || !sa.private_key.includes('BEGIN PRIVATE KEY')) {
    throw new Error('유효한 서비스 계정 키의 필수 항목(type/client_email/project_id/private_key)이 없습니다.');
  }
  const email = sa.client_email.trim().toLowerCase();
  const identity = {
    keyProjectId: sa.project_id,
    targetProjectId: 'cardville',
    emailFingerprint: redact(email),
    keyAndTargetProjectMatch: sa.project_id === 'cardville',
  };
  if (showLocalEmail) identity.clientEmail = email;
  return identity;
}
function main() {
  if (testing) {
    const mock={type:'service_account',project_id:'example-project',
      client_email:'ci-bot@example-project.iam.gserviceaccount.com',private_key:'-----BEGIN PRIVATE KEY-----\nTEST\n-----END PRIVATE KEY-----\n'};
    const result=inspect(JSON.stringify(mock));
    if(result.keyProjectId!=='example-project'||result.emailFingerprint.length!==16||result.clientEmail)process.exit(1);
    if(inspect(JSON.stringify(mock),true).clientEmail!==mock.client_email)process.exit(1);
    console.log('IAM identity helper self-test passed'); return;
  }
  if (local && (!args[fileAt+1] || args[fileAt+1].startsWith('--')))
    throw new Error('사용법: node tools/check-iam-identity.cjs --file "C:\\경로\\service-account.json"');
  if (!local && !process.env.FIREBASE_SA)
    throw new Error('GitHub Secret FIREBASE_SERVICE_ACCOUNT_CARDVILLE이 없습니다.');
  const input=local?fs.readFileSync(args[fileAt+1],'utf8'):process.env.FIREBASE_SA;
  const info=inspect(input,local);
  console.log('계정의 키 프로젝트 ID:',info.keyProjectId);
  console.log('배포 대상 Firebase 프로젝트 ID:',info.targetProjectId);
  console.log('서비스 계정 이메일 SHA-256 앞 16자리:',info.emailFingerprint);
  console.log('키 프로젝트와 배포 프로젝트가 같은가:',info.keyAndTargetProjectMatch?'예':'아니오 (교차 프로젝트 권한도 가능)');
  if (local) console.log('IAM 권한 부여 대상 이메일 (이 PC에만 표시):',info.clientEmail);
  else {
    const summary=process.env.GITHUB_STEP_SUMMARY;
    if (summary) fs.appendFileSync(summary, [
      '## Firebase IAM 본인확인 (비밀키/이메일 비공개)',
      `- 배포 대상 프로젝트: ${info.targetProjectId}`,
      `- 비밀키 생성 프로젝트: ${info.keyProjectId.replace(/[\r\n|]/g,'')}`,
      `- 서비스 계정 이메일 SHA-256 16자리: \`${info.emailFingerprint}\``,
      `- 프로젝트 ID 일치: ${info.keyAndTargetProjectMatch?'예':'아니오 (서비스 계정 교차 프로젝트 가능)'}`,
      '- 이메일 원문과 JSON 비밀키는 표시하지 않음',
      '- 실제 역할 부여 확인은 Google Cloud IAM에서 서비스 계정 식별 후 별도 진행',
      ''
    ].join('\n'));
  }
  if (!info.keyAndTargetProjectMatch) console.warn('주의: JSON 키의 project_id가 cardville과 다릅니다. 해당 서비스 계정에 cardville IAM 역할이 부여되어야 합니다.');
}
try { main(); }
catch(err) { console.error('IAM 계정 검사 오류:',err.message); process.exitCode=1; }
