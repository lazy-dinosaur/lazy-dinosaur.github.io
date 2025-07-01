const fs = require('fs').promises;
const path = require('path');

const PROJECTS_DIR = path.join(__dirname, '..', 'public', 'projects');
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'projects.json');

async function buildProjects() {
  try {
    console.log('🔍 프로젝트 파일들을 찾는 중...');
    
    // projects 디렉토리의 모든 폴더 읽기
    const folders = await fs.readdir(PROJECTS_DIR, { withFileTypes: true });
    const projectFolders = folders.filter(folder => folder.isDirectory());
    
    const projects = [];
    
    for (const folder of projectFolders) {
      const projectJsonPath = path.join(PROJECTS_DIR, folder.name, 'project.json');
      
      try {
        // project.json 파일이 있는지 확인
        await fs.access(projectJsonPath);
        
        // project.json 읽기
        const content = await fs.readFile(projectJsonPath, 'utf-8');
        const projectData = JSON.parse(content);
        
        // 이미지 경로를 절대 경로로 변환
        if (projectData.thumbnail && projectData.thumbnail.startsWith('./')) {
          projectData.thumbnail = `/projects/${folder.name}/${projectData.thumbnail.slice(2)}`;
        }
        
        // demoImages의 경로도 변환
        if (projectData.demoImages) {
          projectData.demoImages = projectData.demoImages.map(image => ({
            ...image,
            url: image.url.startsWith('./') 
              ? `/projects/${folder.name}/${image.url.slice(2)}`
              : image.url
          }));
        }
        
        projects.push(projectData);
        console.log(`✅ ${folder.name} 프로젝트 로드됨`);
        
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`⏭️  ${folder.name} 폴더에 project.json 파일이 없습니다. 건너뜁니다.`);
        } else {
          console.error(`❌ ${folder.name} 프로젝트 로드 실패:`, error.message);
        }
      }
    }
    
    // createdAt 날짜 기준으로 정렬 (최신순)
    projects.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA;
    });
    
    // projects.json 파일 쓰기
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(projects, null, 2));
    
    console.log(`\n✨ 빌드 완료! ${projects.length}개의 프로젝트가 ${OUTPUT_FILE}에 저장되었습니다.`);
    
    // 프로젝트 요약 출력
    console.log('\n📋 프로젝트 목록:');
    projects.forEach((project, index) => {
      console.log(`  ${index + 1}. ${project.title} (${project.id}) - ${project.featured ? '⭐ Featured' : ''}`);
    });
    
  } catch (error) {
    console.error('❌ 빌드 중 오류 발생:', error);
    process.exit(1);
  }
}

// 스크립트 실행
buildProjects();