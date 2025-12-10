// Główny stan aplikacji
const AppState = {
    currentScreen: 'welcome',
    userPreferences: {
        who: '',
        duration: '',
        budget: ''
    },
    duelState: {
        round: 1,
        totalRounds: 8,
        currentCriteria: 'general',
        criteriaHistory: [],
        userChoices: [],
        availableDestinations: [],
        currentPair: [],
        scores: {}
    }
};

// Baza destynacji (Polska)
const destinations = [
    {
        id: 1,
        name: "Mazury",
        description: "Kraina tysiąca jezior idealna na rejsy żaglówką, wędrówki i obcowanie z przyrodą.",
        tags: ["jeziora", "aktywny", "rodzinny", "przyroda", "wypoczynek"],
        details: {
            price: "budget",
            climate: "umiarkowany",
            familyScore: 9,
            coupleScore: 7,
            activityLevel: 8
        },
        imageColor: "#2E8B57"
    },
    {
        id: 2,
        name: "Tatry",
        description: "Najwyższe polskie góry oferujące wspaniałe widoki, szlaki turystyczne i zimowe sporty.",
        tags: ["góry", "aktywny", "widoki", "zima", "lato"],
        details: {
            price: "medium",
            climate: "górski",
            familyScore: 8,
            coupleScore: 8,
            activityLevel: 9
        },
        imageColor: "#4682B4"
    },
    {
        id: 3,
        name: "Bałtyk - Sopot",
        description: "Perła polskiego wybrzeża z piękną plażą, molem i życiem nocnym.",
        tags: ["morze", "miasto", "plaże", "rozrywka", "rodzinny"],
        details: {
            price: "medium",
            climate: "morski",
            familyScore: 8,
            coupleScore: 9,
            activityLevel: 6
        },
        imageColor: "#1E90FF"
    },
    {
        id: 4,
        name: "Bieszczady",
        description: "Dzikie góry z połoninami, idealne na wyprawy z dala od zgiełku cywilizacji.",
        tags: ["góry", "dzikość", "przyroda", "cisza", "wypoczynek"],
        details: {
            price: "budget",
            climate: "górski",
            familyScore: 7,
            coupleScore: 9,
            activityLevel: 7
        },
        imageColor: "#32CD32"
    },
    {
        id: 5,
        name: "Kraków",
        description: "Historyczna stolica Polski z bogatą kulturą, zabytkami i doskonałą kuchnią.",
        tags: ["miasto", "kultura", "historia", "jedzenie", "romantyczny"],
        details: {
            price: "medium",
            climate: "miejski",
            familyScore: 8,
            coupleScore: 9,
            activityLevel: 5
        },
        imageColor: "#DC143C"
    },
    {
        id: 6,
        name: "Karkonosze",
        description: "Góry z magicznymi wodospadami i źródłami termalnymi w pobliskich uzdrowiskach.",
        tags: ["góry", "spa", "zdrowie", "widoki", "rodzinny"],
        details: {
            price: "premium",
            climate: "górski",
            familyScore: 9,
            coupleScore: 8,
            activityLevel: 7
        },
        imageColor: "#8A2BE2"
    },
    {
        id: 7,
        name: "Hel",
        description: "Półwysep z piaszczystymi plażami, latarniami morskimi i rezerwatem fok.",
        tags: ["morze", "plaże", "przyroda", "rodzinny", "wypoczynek"],
        details: {
            price: "budget",
            climate: "morski",
            familyScore: 9,
            coupleScore: 7,
            activityLevel: 5
        },
        imageColor: "#20B2AA"
    },
    {
        id: 8,
        name: "Zakopane",
        description: "Zimowa stolica Polski z kolejką na Kasprowy Wierch i tradycyjną góralską kulturą.",
        tags: ["góry", "zima", "kultura", "sporty", "rodzinny"],
        details: {
            price: "medium",
            climate: "górski",
            familyScore: 8,
            coupleScore: 8,
            activityLevel: 8
        },
        imageColor: "#6495ED"
    },
    {
        id: 9,
        name: "Wrocław",
        description: "Miasto stu mostów z piękną starówką, krasnalami i ogrodem zoologicznym.",
        tags: ["miasto", "rodzinny", "kultura", "rozrywka", "jedzenie"],
        details: {
            price: "medium",
            climate: "miejski",
            familyScore: 9,
            coupleScore: 8,
            activityLevel: 6
        },
        imageColor: "#FF4500"
    },
    {
        id: 10,
        name: "Białowieża",
        description: "Ostatni naturalny las w Europie z żubrami i unikalną przyrodą.",
        tags: ["przyroda", "dzikość", "edukacja", "cisza", "rodzinny"],
        details: {
            price: "budget",
            climate: "leśny",
            familyScore: 8,
            coupleScore: 6,
            activityLevel: 6
        },
        imageColor: "#228B22"
    }
];

// Kryteria pojedynków
const criteriaList = [
    { id: 'general', text: 'Która opcja bardziej Ci się podoba?' },
    { id: 'climate', text: 'Który klimat bardziej Ci odpowiada?' },
    { id: 'family', text: 'Które miejsce jest lepsze dla Ciebie/Twojej grupy?' },
    { id: 'activity', text: 'Który poziom aktywności wolisz?' },
    { id: 'budget', text: 'Która opcja lepiej pasuje do Twojego budżetu?' }
];

// Inicjalizacja aplikacji
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Event Listeners dla ekranu startowego
    document.getElementById('start-btn').addEventListener('click', showConfigScreen);
    document.getElementById('back-to-welcome').addEventListener('click', showWelcomeScreen);
    
    // Event Listeners dla konfiguracji
    setupOptionSelectors();
    document.getElementById('start-duel-btn').addEventListener('click', startDuel);
    
    // Event Listeners dla pojedynków
    document.querySelectorAll('.card-btn').forEach(btn => {
        btn.addEventListener('click', handleCardSelection);
    });
    document.getElementById('skip-btn').addEventListener('click', skipPair);
    document.getElementById('change-criteria-btn').addEventListener('click', changeCriteria);
    
    // Event Listeners dla wyników
    document.getElementById('new-duel-btn').addEventListener('click', restartApp);
    document.getElementById('share-btn').addEventListener('click', shareResults);
    
    // Start z ekranu powitalnego
    showScreen('welcome');
}

// Zarządzanie ekranami
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(`${screenId}-screen`).classList.add('active');
    AppState.currentScreen = screenId;
}

function showWelcomeScreen() {
    showScreen('welcome');
}

function showConfigScreen() {
    showScreen('config');
}

// Konfiguracja - wybór opcji
function setupOptionSelectors() {
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            const group = this.closest('.form-group');
            const input = group.querySelector('input[type="hidden"]');
            const options = group.querySelectorAll('.option');
            
            options.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            input.value = this.dataset.value;
            AppState.userPreferences[input.id] = this.dataset.value;
            
            checkConfigCompletion();
        });
    });
}

function checkConfigCompletion() {
    const { who, duration, budget } = AppState.userPreferences;
    const startBtn = document.getElementById('start-duel-btn');
    startBtn.disabled = !(who && duration && budget);
}

// Rozpoczęcie pojedynków
function startDuel() {
    // Filtruj destynacje na podstawie preferencji
    AppState.duelState.availableDestinations = filterDestinations();
    
    // Inicjalizuj wyniki
    AppState.duelState.scores = {};
    AppState.duelState.availableDestinations.forEach(dest => {
        AppState.duelState.scores[dest.id] = 0;
    });
    
    // Ustaw początkowe kryterium
    AppState.duelState.currentCriteria = 'general';
    updateCriteriaDisplay();
    
    // Rozpocznij pierwszą rundę
    AppState.duelState.round = 1;
    updateRoundCounter();
    generateNewPair();
    
    // Przejdź do ekranu pojedynku
    showScreen('duel');
}

function filterDestinations() {
    const { budget } = AppState.userPreferences;
    
    return destinations.filter(dest => {
        // Filtruj po budżecie
        if (budget === 'budget' && dest.details.price !== 'budget') return false;
        if (budget === 'medium' && dest.details.price === 'premium') return false;
        
        return true;
    });
}

// Generowanie nowej pary destynacji
function generateNewPair() {
    const available = [...AppState.duelState.availableDestinations];
    
    if (available.length < 2) {
        console.error('Za mało dostępnych destynacji!');
        return;
    }
    
    // Losuj dwie różne destynacje
    let index1 = Math.floor(Math.random() * available.length);
    let index2;
    do {
        index2 = Math.floor(Math.random() * available.length);
    } while (index1 === index2);
    
    AppState.duelState.currentPair = [
        available[index1],
        available[index2]
    ];
    
    displayPair();
    updateProgressBar();
}

function displayPair() {
    const [dest1, dest2] = AppState.duelState.currentPair;
    
    // Wyświetl pierwszą destynację
    document.getElementById('title1').textContent = dest1.name;
    document.getElementById('desc1').textContent = dest1.description;
    document.getElementById('image1').style.background = `linear-gradient(135deg, ${dest1.imageColor} 0%, ${lightenColor(dest1.imageColor, 30)} 100%)`;
    document.getElementById('card1').dataset.id = dest1.id;
    
    // Wyświetl tagi
    displayTags(dest1.tags, 'tags1');
    
    // Wyświetl informacje w zależności od kryterium
    displayCriteriaInfo(dest1, 'info1');
    
    // Wyświetl drugą destynację
    document.getElementById('title2').textContent = dest2.name;
    document.getElementById('desc2').textContent = dest2.description;
    document.getElementById('image2').style.background = `linear-gradient(135deg, ${dest2.imageColor} 0%, ${lightenColor(dest2.imageColor, 30)} 100%)`;
    document.getElementById('card2').dataset.id = dest2.id;
    
    displayTags(dest2.tags, 'tags2');
    displayCriteriaInfo(dest2, 'info2');
}

function displayTags(tags, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';
    
    tags.slice(0, 3).forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        container.appendChild(span);
    });
}

function displayCriteriaInfo(destination, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';
    
    const criteria = AppState.duelState.currentCriteria;
    const { details } = destination;
    
    let html = '';
    
    switch(criteria) {
        case 'climate':
            html = `<i class="fas fa-temperature-high"></i> Klimat: ${details.climate}`;
            break;
        case 'family':
            const who = AppState.userPreferences.who;
            let score = who === 'family' ? details.familyScore : 
                       who === 'couple' ? details.coupleScore : 7;
            html = `<i class="fas fa-star"></i> Dopasowanie: ${score}/10`;
            break;
        case 'activity':
            html = `<i class="fas fa-running"></i> Aktywność: ${details.activityLevel}/10`;
            break;
        case 'budget':
            const priceMap = { budget: 'Ekonomiczny', medium: 'Średni', premium: 'Premium' };
            html = `<i class="fas fa-wallet"></i> Cena: ${priceMap[details.price]}`;
            break;
        default:
            html = `<i class="fas fa-map-marker-alt"></i> ${destination.tags.slice(0, 2).join(', ')}`;
    }
    
    container.innerHTML = html;
}

// Obsługa wyboru karty
function handleCardSelection(event) {
    const selectedCard = parseInt(event.target.dataset.card);
    const winner = AppState.duelState.currentPair[selectedCard - 1];
    const loser = AppState.duelState.currentPair[2 - selectedCard];
    
    // Zapisz wybór
    AppState.duelState.userChoices.push({
        round: AppState.duelState.round,
        winner: winner.id,
        loser: loser.id,
        criteria: AppState.duelState.currentCriteria
    });
    
    // Aktualizuj wyniki (prosty system punktowy)
    AppState.duelState.scores[winner.id] += 2;
    AppState.duelState.scores[loser.id] = Math.max(0, AppState.duelState.scores[loser.id] - 1);
    
    // Przejdź do następnej rundy lub wyników
    if (AppState.duelState.round >= AppState.duelState.totalRounds) {
        showResults();
    } else {
        AppState.duelState.round++;
        updateRoundCounter();
        generateNewPair();
        
        // Zmień kryterium co 2 rundy
        if (AppState.duelState.round % 2 === 1) {
            changeCriteria();
        }
    }
}

function skipPair() {
    generateNewPair();
}

function changeCriteria() {
    const currentIndex = criteriaList.findIndex(c => c.id === AppState.duelState.currentCriteria);
    const nextIndex = (currentIndex + 1) % criteriaList.length;
    
    AppState.duelState.currentCriteria = criteriaList[nextIndex].id;
    AppState.duelState.criteriaHistory.push(criteriaList[nextIndex].id);
    
    updateCriteriaDisplay();
    displayPair(); // Odśwież wyświetlane informacje
}

function updateCriteriaDisplay() {
    const criteria = criteriaList.find(c => c.id === AppState.duelState.currentCriteria);
    document.getElementById('current-criteria').textContent = criteria.text;
}

function updateRoundCounter() {
    document.getElementById('round-counter').textContent = 
        `Runda ${AppState.duelState.round}/${AppState.duelState.totalRounds}`;
}

function updateProgressBar() {
    const progress = (AppState.duelState.round / AppState.duelState.totalRounds) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

// Wyświetlanie wyników
function showResults() {
    // Sortuj destynacje według wyników
    const rankedDestinations = AppState.duelState.availableDestinations
        .map(dest => ({
            ...dest,
            score: AppState.duelState.scores[dest.id] || 0
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3); // Top 3
    
    displayResults(rankedDestinations);
    displayUserPreferences();
    showScreen('results');
}

function displayResults(rankedDestinations) {
    const container = document.getElementById('results-container');
    container.innerHTML = '';
    
    rankedDestinations.forEach((dest, index) => {
        const rank = index + 1;
        const matchPercentage = Math.min(95, 70 + (dest.score * 3)); // Symulowane dopasowanie
        
        const resultCard = document.createElement('div');
        resultCard.className = 'result-card';
        resultCard.innerHTML = `
            <div class="result-rank">${rank}</div>
            <h3>${dest.name}</h3>
            <p>${dest.description}</p>
            
            <div class="result-details">
                <div class="result-detail">
                    <i class="fas fa-tags"></i>
                    <span>${dest.tags.slice(0, 3).join(', ')}</span>
                </div>
                <div class="result-detail">
                    <i class="fas fa-wallet"></i>
                    <span>${dest.details.price === 'budget' ? 'Ekonomiczny' : 
                           dest.details.price === 'medium' ? 'Średni' : 'Premium'}</span>
                </div>
                <div class="result-detail">
                    <i class="fas fa-temperature-high"></i>
                    <span>${dest.details.climate}</span>
                </div>
            </div>
            
            <div class="result-match">
                <div class="match-score">
                    <i class="fas fa-check-circle"></i>
                    Dopasowanie: ${matchPercentage}%
                </div>
                <small>Na podstawie ${AppState.duelState.userChoices.length} Twoich wyborów</small>
            </div>
        `;
        
        container.appendChild(resultCard);
    });
}

function displayUserPreferences() {
    const container = document.getElementById('preferences-list');
    container.innerHTML = '';
    
    const { who, duration, budget } = AppState.userPreferences;
    
    const preferences = [
        `Dla: ${getPreferenceText(who, 'who')}`,
        `Czas: ${getPreferenceText(duration, 'duration')}`,
        `Budżet: ${getPreferenceText(budget, 'budget')}`,
        ...getTopTags()
    ];
    
    preferences.forEach(pref => {
        const tag = document.createElement('div');
        tag.className = 'preference-tag';
        tag.textContent = pref;
        container.appendChild(tag);
    });
}

function getPreferenceText(value, type) {
    const maps = {
        who: { single: 'Singiel/ka', couple: 'Para', family: 'Rodzina', friends: 'Przyjaciele' },
        duration: { weekend: 'Weekend', 'long-weekend': 'Długi weekend', week: 'Tydzień' },
        budget: { budget: 'Ekonomiczny', medium: 'Średni', premium: 'Premium' }
    };
    
    return maps[type][value] || value;
}

function getTopTags() {
    // Znajdź najczęściej wybierane tagi
    const tagCount = {};
    AppState.duelState.userChoices.forEach(choice => {
        const winner = AppState.duelState.currentPair.find(d => d.id === choice.winner);
        winner.tags.forEach(tag => {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
    });
    
    return Object.entries(tagCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([tag]) => tag);
}

// Pomocnicze funkcje
function lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return "#" + (
        0x1000000 +
        (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
}

function restartApp() {
    // Zresetuj stan
    AppState.userPreferences = { who: '', duration: '', budget: '' };
    AppState.duelState = {
        round: 1,
        totalRounds: 8,
        currentCriteria: 'general',
        criteriaHistory: [],
        userChoices: [],
        availableDestinations: [],
        currentPair: [],
        scores: {}
    };
    
    // Zresetuj UI
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    document.querySelectorAll('input[type="hidden"]').forEach(input => input.value = '');
    document.getElementById('start-duel-btn').disabled = true;
    
    // Wróć do konfiguracji
    showConfigScreen();
}

function shareResults() {
    const topDestination = AppState.duelState.availableDestinations
        .map(d => ({ ...d, score: AppState.duelState.scores[d.id] || 0 }))
        .sort((a, b) => b.score - a.score)[0];
    
    const shareText = `Moja idealna wycieczka według TripDuel to: ${topDestination.name}! 
Sprawdź też: ${window.location.href}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Moja wycieczka z TripDuel',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: kopiuj do schowka
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Wynik skopiowany do schowka! Możesz go teraz udostępnić.');
        });
    }
}