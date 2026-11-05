const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 80;

// 정적 파일 제공 (index.html, css, js, assets 등)
app.use(express.static(path.join(__dirname), {
  index: 'index.html',
  dotfiles: 'ignore'
}));

// 루트 경로 핸들러
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 서버 실행
const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log('🚀 2026 책만세 웹 서버가 성공적으로 시작되었습니다!');
  console.log(`🌐 로컬 접속 주소: http://localhost (포트: ${PORT})`);
  console.log(`📁 서비스 디렉터리: ${__dirname}`);
  console.log('====================================================');
});

// 에러 핸들링
server.on('error', (err) => {
  if (err.code === 'EACCES') {
    console.error(`❌ 포트 ${PORT}에 접근할 수 없습니다. (권한 부족)`);
    console.error('💡 다른 포트로 실행하려면 PORT 환경변수를 지정하세요 (예: PORT=3000 npm start)');
  } else if (err.code === 'EADDRINUSE') {
    console.error(`❌ 포트 ${PORT}가 이미 사용 중입니다.`);
    console.error('💡 기존 프로세스를 종료하거나 PORT=3000 npm start 명령을 사용하세요.');
  } else {
    console.error('❌ 서버 에러:', err);
  }
  process.exit(1);
});

// 종료 시그널 처리
process.on('SIGINT', () => {
  console.log('\n🛑 서버를 종료합니다...');
  server.close(() => {
    console.log('✅ 서버가 안전하게 종료되었습니다.');
    process.exit(0);
  });
});

module.exports = app;
