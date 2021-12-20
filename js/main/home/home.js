import { petIcon, toxicIcon, lowSunIcon, highSunIcon, noSunIcon, oneDropIcon, twoDropsIcon, threeDropsIcon} from '../../requirements.js';

const filterTypes = [
    { sun: '' },
    { water: '' },
    { pets: '' }
]

// API Request

function getPlantsData(sun, water, pets) {
	return new Promise((resolve, reject) => {
		fetch(`https://front-br-challenges.web.app/api/v2/green-thumb/?sun=${sun}&water=${water}&pets=${pets}`)
			.then(res => {
                if (res.ok) {
                    resolve(res.json());
                }

                if (!res.ok) {
                    throw new Error();
                }
            })
			.catch(err => {
				reject(err);
			})
		});
}



// Template creating and actions


function scrollToHero() {
    const goTopBtn = document.querySelector('.go-top-btn');

    goTopBtn.addEventListener('click', () => {
        window.scrollTo(0, 0);
    })
}

function scrollToFilters() {
    const arrowGoDown = document.querySelector('.hero__arrow-down');
    const filterSection = document.querySelector('.filter');

    arrowGoDown.addEventListener('click', () => {
        filterSection.scrollIntoView();
    })
}

function getNoResultsMessage(type) {
    let noResultsTitle = type === 'no_items' ? 'No results yet…' : 'Oh, no...';
    let noResultsText = type === 'no_items' ? 'Use the filters above to find the plant that best fits your environment :)' : 'It looks like there is an error. Try again later.';

    document.querySelector('.no-results__title').innerHTML = noResultsTitle;
    document.querySelector('.no-results__text').innerHTML = noResultsText;
}

function setResultsDisplay(responseDisplay, noResultsDisplay) {
    document.querySelector('.response').style.display = responseDisplay;
    document.querySelector('.no-results').style.display = noResultsDisplay;
}

// Get plant icons

function getPetIcon(plant) {
    return {
        path: plant.toxicity ? toxicIcon : petIcon,
        label: plant.toxicity ? 'Toxic' : 'Pet friend'
    }
};

function getSunIcon(plant) {
    if (plant.sun === 'low') {
        return {
            path: lowSunIcon,
            label: 'Low sun'
        }
    }
    
    if (plant.sun === 'high') {
        return {
            path: highSunIcon,
            label: 'High sun'
        }
    }
    
    if (plant.sun === 'no') {
        return {
            path: noSunIcon,
            label: 'No sun'
        }
    }
};

function getDropIcon(plant) {
    if (plant.water === 'daily') {
        return {
            path: oneDropIcon,
            label: 'Water daily'
        }
    }

    if (plant.water === 'regularly') {
        return {
            path: twoDropsIcon,
            label: 'Water regularly'
        }
    }

    if (plant.water === 'rarely') {
        return {
            path: threeDropsIcon,
            label: 'Water rarely'
        }
    }
};

// Generates plants container

function generatePlantElement(plant) {
    let plantType = document.createElement('div');
    let plantClasses = plant.staff_favorite ? ['plant', 'staff-favorite'] : ['plant'];

    plantType.classList.add(...plantClasses);
    
    plantType.innerHTML = `
        <div class="staff-favorite__badge"><span>&#10024;</span><span class="staff-favorite__badge-text">Staff favorite</span></div>

        <div class="plant-image-container">
            <img class="plant-image" src="${plant.url}" alt="${plant.name}" />
        </div>
    
        <div class="plant-infos">
            <h4 class="plant-name">${plant.name}</h4>
                      
            <div class="plant-details">
                <h4 class="plant-price">$${plant.price}</h4>
    
                <div class="plant-icons">
                    <img class="plant-icon" src="${getPetIcon(plant).path}" alt="${getPetIcon(plant).label}" />
                    <img class="plant-icon" src="${getSunIcon(plant).path}" alt="${getSunIcon(plant).label}" />
                    <img class="plant-icon" src="${getDropIcon(plant).path}" alt="${getDropIcon(plant).label}" />
                </div>
            </div>
        </div>
    `;

    return plantType;
}


function generatePlantsContainer(plants) {
    const responsePlantsContainer = document.querySelector('.response__plants-wrapper');
    responsePlantsContainer.innerHTML = '';

    let plantType = {};
    let methodToInsert = 'appendChild';

    for(let i = 0; i < plants.length; i++) {
        plantType = generatePlantElement(plants[i]);

        methodToInsert = plantType.className.includes('staff-favorite') ? 'insertBefore' : 'appendChild';
        methodToInsert = plantType.className.includes('highlighted') ? 'insertBefore' : methodToInsert;
        
        responsePlantsContainer[methodToInsert](plantType, responsePlantsContainer.firstChild);
    }

    if (plants.length > 3) {
        responsePlantsContainer.firstChild.classList.add('highlighted');
    }
}

// Filters apply (calls API)

function applyFilters() {
    if (filterTypes.sun && filterTypes.water && filterTypes.pets) {
        getPlantsData(filterTypes.sun, filterTypes.water, filterTypes.pets)
            .then(plants => {
                if (plants.length) {
                    setResultsDisplay('grid', 'none');
                    generatePlantsContainer(plants);
                    return;
                }
            
                if (!plants.length) {
                    getNoResultsMessage('no_items');
                    setResultsDisplay('none', 'flex');
                }
            })
            .catch(err => {
                getNoResultsMessage('error');
                setResultsDisplay('none', 'flex');
            });
    }
}

function setFilterFunction() {
    const filterSelectors = document.querySelectorAll('.filter__type-selector');
    
    for(let i = 0; i < filterSelectors.length; i++) {
        let currentFilter = filterSelectors[i];
        
        currentFilter.addEventListener("change", () => {
            const filterName = currentFilter.id;
            const filterValue = currentFilter.value;

            filterTypes[filterName] = filterValue;
            applyFilters();
        });
    }
}


// Start script

window.onload = () => {
    scrollToHero();
    
    scrollToFilters();
    
    setFilterFunction();

    getNoResultsMessage('no_items');

    setResultsDisplay('none', 'flex');
}
