# Freight CBM — 출시 체크리스트 (2026-11-05 기준)

## 단계 0. 로컬 검증

- [x] 소스 코드 작성
- [x] 계산 로직 테스트 작성 및 로컬 `npm test` 실행
- [x] Git 저장소 초기화 및 최초 커밋
- [ ] 개인 컴퓨터에서 `npm install` 성공
- [ ] 개인 컴퓨터에서 `npx expo-doctor` 검증
- [ ] Expo Go 실제 iPhone 실행 및 UI 테스트 (실기기 검증 전 배포 완료로 표시 금지)

## 단계 1. GitHub

1. https://github.com/new 에서 본인 계정으로 이름 `freight-cbm`의 **빈 공개 저장소** 생성. README / LICENSE / .gitignore 자동 추가하지 않기.
2. 압축 파일의 `freight-cbm` 폴더에 들어간 뒤 다음 실행:

   ```bash
   git remote add origin https://github.com/schiele19c/freight-cbm.git
   git branch -M main
   git push -u origin main
   ```

3. GitHub 웹에서 소스와 첫 커밋 확인. 별도 비밀키나 인증 파일은 push하지 않기.

## 등록 전 유의사항

**개인(Individual) Apple Developer 계정으로 공개 출시하면 앱스토어 판매자(Seller)에 법적 실명이 표시됩니다.** 개인 정보 공개 여부를 고려하고, 조직명으로 표시하려면 Apple의 조직 가입 요건을 별도로 검토하세요.

## 단계 2. Apple Developer / Expo (유료 개발자 회원 자격 필요)

- [ ] Apple Developer Program 가입·활성화
- [ ] Expo 무료 계정 생성: https://expo.dev/
- [ ] `app.json`의 iOS Bundle Identifier가 다른 앱과 중복되지 않는지 확인. **첫 등록 이후 변경 주의.**
- [ ] Windows PowerShell / Terminal에서 `npm install -g eas-cli`
- [ ] `eas login`
- [ ] `eas build:configure`
- [ ] `eas build --platform ios --profile production`
- [ ] Apple 서명(credentials) 프롬프트 확인 및 본인 계정 로그인 / 2FA 수행. 비밀번호·인증코드·API 비밀키는 AI 대화에 입력하지 않기.
- [ ] 빌드 로그 및 IPA 생성 성공 확인

## 단계 3. App Store Connect

- [ ] https://appstoreconnect.apple.com/ 에 앱 레코드 추가 (앱 이름, 언어 English, iOS 플랫폼, Bundle ID, SKU 등)
- [ ] 빌드 업로드: `eas submit --platform ios --profile production` (앱 레코드 생성 및 인증 필요)
- [ ] TestFlight에서 iPhone 실제 설치·작동 확인 (단위별 계산, 오류 입력, 복사, 화면 스크롤)
- [ ] 영어 설명·키워드·실제 화면 캡처 등록
- [ ] https://schiele19c.github.io/freight-cbm/privacy.html 페이지를 GitHub Pages로 공개한 다음 **직접 열려 있는지 확인**하여 Privacy Policy URL 입력
- [ ] https://schiele19c.github.io/freight-cbm/support.html 페이지 역시 실제 공개 여부 확인 후 Support URL 입력
- [ ] App Privacy 질문: 실제 최종 앱의 데이터 처리 관행을 검토한 뒤 답변. 현 구현은 개발자 측 데이터 수집·계정·광고·분석 없음.
- [ ] 연령 등급, 콘텐츠 권리, 접근성, 수출 규정, 가격/판매 가능 지역, 기타 Apple 요청사항 응답
- [ ] App Review Notes에 `Simple, offline cargo volume calculator. No login is required. Supports centimetres, inches and feet and multiple identical packages.` 기재 가능
- [ ] **Submit for Review** 누른 뒤 Apple 심사 결과 확인. 이 프로젝트만으로 심사 승인 보장 불가(특히 Guideline 4.2 Minimum Functionality).

## 단계 4. GitHub Pages 공개

GitHub 저장소 Settings → Pages → Build and deployment: `Deploy from a branch` → Branch `main`, Folder `/docs` → Save. 배포 완료 후 위 Privacy/Support 주소를 실제로 방문해 확인한다. 웹 주소는 저장소가 생성되고 Pages 설정이 완료되기 전까지 존재하지 않는다.

## 앱스토어용 설명 초안

**Name:** Freight CBM

**Subtitle:** Cargo Volume Calculator

**Description:**

Calculate cargo volume in seconds. Freight CBM is a lightweight offline calculator for logistics and shipping workflows. Enter length, width, height and quantity; choose centimetres, inches or feet; and instantly see total cubic metres (CBM) and cubic feet (CFT). Copy the result in one tap. No account, internet connection, or cargo documents required.

**Keywords:** cbm,cubic metre,volume,freight,cargo,shipping,logistics,feet,inches

**Test scenario:** 48 × 40 × 40 inches, quantity 2 → 2.5171 CBM, 88.89 CFT.

**Notes:** This calculator is not a chargeable-weight, customs, or container-load-planning tool.
