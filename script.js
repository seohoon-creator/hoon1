
let selectedNumbers = [];
let isDrawing = false;

// 페이지 로드 시 숫자 박스들 생성
document.addEventListener('DOMContentLoaded', function() {
    createNumberBoxes();
    showWelcomeMessage();
});

function showWelcomeMessage() {
    Swal.fire({
        title: '청소당번 뽑기에 오신 것을 환영합니다! 🎉',
        text: '1번부터 25번까지 번호 중에서 랜덤하게 선택해드립니다.',
        icon: 'success',
        confirmButtonText: '시작하기',
        confirmButtonColor: '#007bff',
        background: 'rgba(255, 255, 255, 0.95)',
        backdrop: `
            rgba(0,0,123,0.4)
            left top
            no-repeat
        `,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    });
}

function createNumberBoxes() {
    const container = document.getElementById('numbers-container');
    container.innerHTML = '';

    for (let i = 1; i <= 25; i++) {
        const numberBox = document.createElement('div');
        numberBox.className = 'number-box';
        numberBox.id = `number-${i}`;
        numberBox.textContent = i;
        
        // 호버 효과를 위한 이벤트 리스너 추가
        numberBox.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(-3px) scale(1.05)';
            }
        });
        
        numberBox.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = '';
            }
        });
        
        container.appendChild(numberBox);
    }
}

async function drawNumber() {
    if (isDrawing) return;
    
    const drawBtn = document.getElementById('draw-btn');
    const resultCard = document.getElementById('result-card');
    const selectedNumberDiv = document.getElementById('selected-number');

    // 이전 선택 초기화
    resetNumbers(false);

    // 확인 대화상자 표시
    const result = await Swal.fire({
        title: '청소당번을 뽑으시겠습니까?',
        text: '랜덤으로 한 명이 선택됩니다!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '네, 뽑겠습니다!',
        cancelButtonText: '취소',
        background: 'rgba(255, 255, 255, 0.95)',
        showClass: {
            popup: 'animate__animated animate__zoomIn'
        }
    });

    if (!result.isConfirmed) return;

    isDrawing = true;

    // 버튼 로딩 상태
    drawBtn.disabled = true;
    drawBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>뽑는 중...';
    drawBtn.classList.add('btn-loading');

    // 로딩 알림 표시
    Swal.fire({
        title: '청소당번을 뽑고 있습니다...',
        html: '<div class="d-flex justify-content-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>',
        showConfirmButton: false,
        allowOutsideClick: false,
        background: 'rgba(255, 255, 255, 0.95)',
        timer: 2000
    });

    // 1-25 중에서 랜덤 번호 선택
    const availableNumbers = [];
    for (let i = 1; i <= 25; i++) {
        availableNumbers.push(i);
    }

    // Fisher-Yates 셔플 알고리즘
    for (let i = availableNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableNumbers[i], availableNumbers[j]] = [availableNumbers[j], availableNumbers[i]];
    }

    const selectedNumber = availableNumbers[0];

    // 드라마틱한 효과를 위한 지연
    setTimeout(async () => {
        // 선택된 번호 하이라이트
        const numberBox = document.getElementById(`number-${selectedNumber}`);
        numberBox.classList.add('selected');

        // 결과 표시
        selectedNumberDiv.textContent = `${selectedNumber}번`;
        resultCard.style.display = 'block';

        // 성공 알림
        await Swal.fire({
            title: '🎉 청소당번이 결정되었습니다!',
            html: `
                <div class="text-center">
                    <div class="display-1 fw-bold text-primary mb-3">${selectedNumber}번</div>
                    <p class="lead">축하합니다! 오늘의 청소당번입니다.</p>
                    <div class="mt-3">
                        <i class="fas fa-broom fa-3x text-warning"></i>
                    </div>
                </div>
            `,
            icon: 'success',
            confirmButtonText: '확인',
            confirmButtonColor: '#28a745',
            background: 'rgba(255, 255, 255, 0.95)',
            showClass: {
                popup: 'animate__animated animate__bounceIn'
            },
            customClass: {
                popup: 'swal-wide'
            }
        });

        // 버튼 원상태로 복구
        drawBtn.disabled = false;
        drawBtn.innerHTML = '<i class="fas fa-dice me-2"></i>번호 뽑기';
        drawBtn.classList.remove('btn-loading');

        selectedNumbers = [selectedNumber];
        isDrawing = false;
    }, 2500);
}

function resetNumbers(showConfirm = true) {
    if (showConfirm && selectedNumbers.length > 0) {
        Swal.fire({
            title: '초기화하시겠습니까?',
            text: '선택된 번호가 모두 지워집니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '네, 초기화하겠습니다',
            cancelButtonText: '취소',
            background: 'rgba(255, 255, 255, 0.95)'
        }).then((result) => {
            if (result.isConfirmed) {
                performReset();
                Swal.fire({
                    title: '초기화 완료!',
                    text: '새로운 번호를 뽑을 수 있습니다.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    background: 'rgba(255, 255, 255, 0.95)'
                });
            }
        });
    } else {
        performReset();
    }
}

function performReset() {
    // 모든 선택 해제
    for (let i = 1; i <= 25; i++) {
        const numberBox = document.getElementById(`number-${i}`);
        if (numberBox) {
            numberBox.classList.remove('selected');
        }
    }

    // 결과 카드 숨기기
    const resultCard = document.getElementById('result-card');
    resultCard.style.display = 'none';

    selectedNumbers = [];
    isDrawing = false;
}

// 키보드 단축키 지원
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        if (!isDrawing) {
            drawNumber();
        }
    } else if (event.code === 'Escape') {
        if (!isDrawing) {
            resetNumbers();
        }
    }
});

// SweetAlert2 커스텀 스타일 추가
const style = document.createElement('style');
style.textContent = `
    .swal-wide {
        width: 600px !important;
    }
    
    @media (max-width: 768px) {
        .swal-wide {
            width: 90% !important;
        }
    }
`;
document.head.appendChild(style);
