
let draggedSkill = null;

function handleDragStart(e) {
    draggedSkill = this;
    this.style.opacity = '0.4';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedSkill !== this) {
        const draggedHTML = draggedSkill.innerHTML;
        draggedSkill.innerHTML = this.innerHTML;
        this.innerHTML = draggedHTML;
        
        setupDragEvents(draggedSkill);
        setupDragEvents(this);
        
        document.title = 'Naruto-Arena Character Creator [BETA]';
    }
    
    this.classList.remove('drag-over');
    return false;
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    document.querySelectorAll('.charskill').forEach(skill => {
        skill.classList.remove('drag-over');
    });
}

function setupDragEvents(element) {
    element.setAttribute('draggable', 'true');
    element.addEventListener('dragstart', handleDragStart, false);
    element.addEventListener('dragenter', handleDragEnter, false);
    element.addEventListener('dragover', handleDragOver, false);
    element.addEventListener('dragleave', handleDragLeave, false);
    element.addEventListener('drop', handleDrop, false);
    element.addEventListener('dragend', handleDragEnd, false);
}

function initDragAndDrop() {
    document.querySelectorAll('.charskill').forEach(skill => {
        setupDragEvents(skill);
    });
}

const defaultData = {
    characterName: "Haruno Sakura",
    characterDescription: "A Genin from Team 7, Sakura is very intelligent, but self-conscious about herself. Having just recently received training from Tsunade, Sakura is now able to deliver powerful punches and heal her own allies.",
    characterPortrait: "https://i.imgur.com/TWShCf2.png",
    unlockRequirement: "No requirements",
    skills: [
        {
            name: "KO Punch",
            description: "Sakura punches one enemy with all her strength, dealing 20 damage to them and stunning their physical and mental skills for 1 turn. During 'Inner Sakura', this skill will deal 10 additional damage.",
            image: "https://i.imgur.com/x0Yqker.png",
            cooldown: "None",
            energy: { taijutsu: 1, bloodline: 0, ninjutsu: 0, genjutsu: 0, random: 0 },
            classes: "Physical, Melee, Instant"
        },
        {
            name: "Cure",
            description: "Using basic healing techniques, Sakura heals herself or an ally for 25 health.",
            image: "https://i.imgur.com/M2O5AdG.png",
            cooldown: "None",
            energy: { taijutsu: 0, bloodline: 0, ninjutsu: 1, genjutsu: 0, random: 0 },
            classes: "Chakra, Instant"
        },
        {
            name: "Inner Sakura",
            description: "Sakura's inner self surfaces and urges her on. For 4 turns, Sakura will gain 10 points of damage reduction. During this time, Sakura will ignore non-damage effects and 'KO Punch' will deal 10 additional damage.",
            image: "https://i.imgur.com/03BjSkn.jpg",
            cooldown: "4",
            energy: { taijutsu: 0, bloodline: 0, ninjutsu: 2, genjutsu: 0, random: 0 },
            classes: "Mental, Instant, Unique"
        },
        {
            name: "Sakura Replacement Technique",
            description: "This skill makes Haruno Sakura invulnerable for 1 turn.",
            image: "https://i.imgur.com/hGOwcqv.png",
            cooldown: "4",
            energy: { taijutsu: 0, bloodline: 0, ninjutsu: 2, genjutsu: 0, random: 0 },
            classes: "Chakra, Instant"
        }
    ]
};

let currentSkillElement = null;

function openEnergySelector(energyLink) {
    currentSkillElement = energyLink.closest('.charskill');
    const modal = document.getElementById('energyModal');
    
    const energyDisplay = currentSkillElement.querySelector('.energy-display');
    const currentEnergy = {
        taijutsu: energyDisplay.querySelectorAll('.energy-square.taijutsu').length,
        bloodline: energyDisplay.querySelectorAll('.energy-square.bloodline').length,
        ninjutsu: energyDisplay.querySelectorAll('.energy-square.ninjutsu').length,
        genjutsu: energyDisplay.querySelectorAll('.energy-square.genjutsu').length,
        random: energyDisplay.querySelectorAll('.energy-square.random').length
    };
    
    const energyTypes = modal.querySelectorAll('.energy-type');
    energyTypes.forEach(energyType => {
        let label = energyType.querySelector('.energy-label').textContent.replace(':', '').toLowerCase();
        if (label === 'taijutsu') label = 'taijutsu';
        if (label === 'bloodline') label = 'bloodline';
        if (label === 'ninjutsu') label = 'ninjutsu';
        if (label === 'genjutsu') label = 'genjutsu';
        const count = currentEnergy[label] || 0;
        const countElement = energyType.querySelector('.energy-count');
        const squaresElement = energyType.querySelector('.energy-squares');
        
        countElement.textContent = count;
        squaresElement.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const square = document.createElement('div');
            square.className = `energy-square ${label}`;
            squaresElement.appendChild(square);
        }
    });
    
    modal.style.display = 'block';
}

function closeEnergySelector(event) {
    if (event && event.target !== event.currentTarget) return;
    
    const modal = document.getElementById('energyModal');
    
    if (currentSkillElement) {
        updateEnergyDisplay();
    }
    
    modal.style.display = 'none';
    currentSkillElement = null;
}

function updateEnergyDisplay() {
    if (!currentSkillElement) return;
    
    const modal = document.getElementById('energyModal');
    const energyTypes = modal.querySelectorAll('.energy-type');
    const energyDisplay = currentSkillElement.querySelector('.energy-display');
    
    energyDisplay.innerHTML = '';
    
    energyTypes.forEach(energyType => {
        let label = energyType.querySelector('.energy-label').textContent.replace(':', '').toLowerCase();
        if (label === 'taijutsu') label = 'taijutsu';
        if (label === 'bloodline') label = 'bloodline';
        if (label === 'ninjutsu') label = 'ninjutsu';
        if (label === 'genjutsu') label = 'genjutsu';
        const count = parseInt(energyType.querySelector('.energy-count').textContent);
        
        for (let i = 0; i < count; i++) {
            const square = document.createElement('div');
            square.className = `energy-square ${label}`;
            energyDisplay.appendChild(square);
        }
    });
}

function adjustEnergy(energyTypeElement, change) {
    const countElement = energyTypeElement.querySelector('.energy-count');
    const squaresElement = energyTypeElement.querySelector('.energy-squares');
    let energyLabel = energyTypeElement.querySelector('.energy-label').textContent.replace(':', '').toLowerCase();
    if (energyLabel === 'taijutsu') energyLabel = 'taijutsu';
    if (energyLabel === 'bloodline') energyLabel = 'bloodline';
    if (energyLabel === 'ninjutsu') energyLabel = 'ninjutsu';
    if (energyLabel === 'genjutsu') energyLabel = 'genjutsu';
    
    let currentCount = parseInt(countElement.textContent);
    let newCount = Math.max(0, currentCount + change);
    
    countElement.textContent = newCount;
    
    squaresElement.innerHTML = '';
    for (let i = 0; i < newCount; i++) {
        const square = document.createElement('div');
        square.className = `energy-square ${energyLabel}`;
        squaresElement.appendChild(square);
    }
    
    if (!isLoading) {
        document.title = '* Naruto-Arena Character Creator [BETA]';
    }
}

function changeImage(imgElement) {
    const modal = document.createElement('div');
    modal.className = 'image-upload-modal';
    modal.innerHTML = `
        <div class="image-upload-content">
            <div class="image-upload-header">
                <h3>Change Image</h3>
                <button class="close-btn" onclick="this.closest('.image-upload-modal').remove()">&times;</button>
            </div>
            <div class="image-upload-body">
                <div class="upload-option">
                    <h4>Upload to Imgur (Anonymous):</h4>
                    <input type="file" accept="image/*" class="file-input" onchange="handleImageUpload(event, this)">
                    <button onclick="this.previousElementSibling.click()" class="upload-btn">Choose File</button>
                    <div class="upload-status"></div>
                </div>
                <div class="upload-divider">OR</div>
                <div class="upload-option">
                    <h4>Enter Image URL:</h4>
                    <input type="text" placeholder="https://example.com/image.jpg" class="url-input" value="${imgElement.src}">
                    <button onclick="handleUrlInput(this)" class="url-btn">Use URL</button>
                </div>
                <div class="upload-divider">OR</div>
                <div class="upload-option">
                    <h4>Manual Upload to Image Host:</h4>
                    <p class="manual-instructions">1. Click button below to open Imgur in new tab<br>2. Upload your image there<br>3. Copy the direct image URL<br>4. Paste it in the URL field above</p>
                    <button onclick="window.open('https://imgur.com/upload', '_blank')" class="manual-btn">Open Imgur Upload</button>
                </div>
            </div>
            <div class="image-upload-footer">
                <button onclick="this.closest('.image-upload-modal').remove()" class="cancel-btn">Cancel</button>
            </div>
        </div>
    `;
    
    modal.dataset.targetImage = imgElement.src;
    modal.targetImageElement = imgElement;
    
    document.body.appendChild(modal);
}

function handleImageUpload(event, fileInput) {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
    }

    const modal = fileInput.closest('.image-upload-modal');
    const statusDiv = modal.querySelector('.upload-status');
    const targetImg = modal.targetImageElement;
    
    statusDiv.innerHTML = '<div class="upload-progress">Uploading to Imgur...</div>';
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'file');
    
    fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
            'Authorization': 'Client-ID 546c25a59c58ad7' 
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const imageUrl = data.data.link;
            targetImg.src = imageUrl;
            statusDiv.innerHTML = '<div class="upload-success">✓ Upload successful!</div>';
            
            setTimeout(() => {
                modal.remove();
            }, 1000);
            
            document.title = '* Naruto-Arena Character Creator [BETA]';
        } else {
            throw new Error(data.data?.error || 'Upload failed');
        }
    })
    .catch(error => {
        console.error('Upload error:', error);
        statusDiv.innerHTML = `
            <div class="upload-error">
                Upload failed. Please try:<br>
                1. Using the manual upload option below<br>
                2. Or paste a direct image URL
            </div>
        `;
    });
}


function handleUrlInput(button) {
    const modal = button.closest('.image-upload-modal');
    const urlInput = modal.querySelector('.url-input');
    const newUrl = urlInput.value.trim();
    
    if (newUrl) {
        const targetImg = modal.targetImageElement;
        targetImg.src = newUrl;
        
        const testImg = new Image();
        testImg.onerror = function() {
            alert("Image failed to load. Please check the URL.");
        };
        testImg.onload = function() {
            modal.remove();
            document.title = '* Naruto-Arena Character Creator [BETA]';
        };
        testImg.src = newUrl;
    } else {
        alert('Please enter a valid URL.');
    }
}

function getCurrentData() {
    function cleanText(text) {
        return text.replace(/\s+/g, ' ').trim();
    }
    
    const characterName = cleanText(document.querySelector('.character-name').textContent);
    const characterDescription = cleanText(document.querySelector('.character-description').textContent);
    const characterPortrait = document.querySelector('.character-portrait').src;
    const unlockRequirement = cleanText(document.querySelector('.unlock-requirement').textContent);
    
    const skillElements = document.querySelectorAll('.charskill');
    const skills = [];
    
    skillElements.forEach(skillElement => {
        const energyDisplay = skillElement.querySelector('.energy-display');
        const energy = {
            taijutsu: energyDisplay.querySelectorAll('.energy-square.taijutsu').length,
            bloodline: energyDisplay.querySelectorAll('.energy-square.bloodline').length,
            ninjutsu: energyDisplay.querySelectorAll('.energy-square.ninjutsu').length,
            genjutsu: energyDisplay.querySelectorAll('.energy-square.genjutsu').length,
            random: energyDisplay.querySelectorAll('.energy-square.random').length
        };
        
        const skill = {
            name: cleanText(skillElement.querySelector('.skill-name').textContent),
            description: cleanText(skillElement.querySelector('.skill-description').textContent),
            image: skillElement.querySelector('.skill-image').src,
            cooldown: cleanText(skillElement.querySelector('.cooldown').textContent),
            energy: energy,
            classes: cleanText(skillElement.querySelector('.skill-classes').textContent)
        };
        skills.push(skill);
    });
    
    return {
        characterName,
        characterDescription,
        characterPortrait,
        unlockRequirement,
        skills
    };
}

function loadDataIntoPage(data) {
    document.querySelector('.character-name').textContent = data.characterName;
    document.querySelector('.character-description').textContent = data.characterDescription;
    document.querySelector('.character-portrait').src = data.characterPortrait;
    document.querySelector('.unlock-requirement').textContent = data.unlockRequirement;
    
    const skillsContainer = document.querySelector('.character-container center');
    const addSkillContainer = document.querySelector('.add-skill-container');
    

    const pageDescription = document.querySelector('.pagedescription');
    let nextElement = pageDescription.nextElementSibling;
    
    while (nextElement && !nextElement.classList.contains('add-skill-container')) {
        const toRemove = nextElement;
        nextElement = nextElement.nextElementSibling;
        toRemove.remove();
    }
    
    data.skills.forEach((skill, index) => {
        const skillHTML = `
            <div class="charskill">
                &nbsp;Skill: 
                <h2 class="skill-name" contenteditable="true">${skill.name}</h2>
                <button class="remove-skill-btn" onclick="removeSkill(this)" title="Remove this skill">&times;</button>
                <div class="dots"></div>
                <div class="skilldescr">
                    <img src="${skill.image}" class="pageborda skill-image" align="left" onclick="changeImage(this)">
                    <span class="font-fix skill-description" contenteditable="true" style="min-height:83px">
                        ${skill.description}
                    </span>
                </div>
                <div class="dots"></div>
                <div class="fleft">
                    &nbsp;<u class="font-fix">Cooldown:</u> <span class="cooldown" contenteditable="true">${skill.cooldown}</span>
                </div>
                <div class="fright">
                    <u class="font-fix energy-required-link" onclick="openEnergySelector(this)">Chakra required:</u> 
                    <div class="energy-display">
                    </div>
                </div>
                <div class="clear"></div>
                <div class="pageinfo fleft">
                    &nbsp;Classes: <span class="skill-classes" contenteditable="true">${skill.classes}</span>.
                </div>
            </div>`;
        
        addSkillContainer.insertAdjacentHTML('beforebegin', skillHTML);
        
        if (index % 2 === 1) {
            const clearDiv = document.createElement('div');
            clearDiv.className = 'clear';
            addSkillContainer.insertAdjacentElement('beforebegin', clearDiv);
        }
    });
    
    const allSkillElements = document.querySelectorAll('.charskill');
    data.skills.forEach((skill, index) => {
        if (allSkillElements[index]) {
            const energyDisplay = allSkillElements[index].querySelector('.energy-display');
            energyDisplay.innerHTML = '';
            
            if (skill.energy) {
                Object.entries(skill.energy).forEach(([type, count]) => {
                    for (let i = 0; i < count; i++) {
                        const square = document.createElement('div');
                        square.className = `energy-square ${type}`;
                        energyDisplay.appendChild(square);
                    }
                });
            }
        }
    });
}

function saveData() {
    const data = getCurrentData();
    localStorage.setItem('characterData', JSON.stringify(data));
    alert('Character data saved!');
}

function loadData() {
    const savedData = localStorage.getItem('characterData');
    if (savedData) {
        const data = JSON.parse(savedData);
        loadDataIntoPage(data);
        alert('Character data loaded!');
    } else {
        alert('No saved data found!');
    }
}

function exportData() {
    const data = getCurrentData();
    
    const formattedData = {
        name: data.characterName,
        description: data.characterDescription,
        url: data.characterPortrait,
        skills: data.skills.map(skill => {
            const energyArray = [];
            if (skill.energy) {
                if (skill.energy.taijutsu > 0) {
                    for (let i = 0; i < skill.energy.taijutsu; i++) energyArray.push("Taijutsu");
                }
                if (skill.energy.bloodline > 0) {
                    for (let i = 0; i < skill.energy.bloodline; i++) energyArray.push("Bloodline");
                }
                if (skill.energy.ninjutsu > 0) {
                    for (let i = 0; i < skill.energy.ninjutsu; i++) energyArray.push("Ninjutsu");
                }
                if (skill.energy.genjutsu > 0) {
                    for (let i = 0; i < skill.energy.genjutsu; i++) energyArray.push("Genjutsu");
                }
                if (skill.energy.random > 0) {
                    for (let i = 0; i < skill.energy.random; i++) energyArray.push("Random");
                }
            }
            
            const classesArray = skill.classes ? skill.classes.split(', ').map(c => c.trim()) : [];
            
            return {
                name: skill.name,
                description: skill.description,
                energy: energyArray,
                classes: classesArray,
                cooldown: skill.cooldown === "None" ? 0 : parseInt(skill.cooldown) || 0,
                url: skill.image
            };
        })
    };
    
    const dataStr = JSON.stringify(formattedData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = data.characterName.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_character.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function importData() {
    const file = document.getElementById('importFile').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const rawData = JSON.parse(e.target.result);
                
                let data;
                if (rawData.name && rawData.skills && !rawData.characterName) {
                    data = convertNewFormatToInternal(rawData);
                } else {
                    data = rawData;
                }
                
                loadDataIntoPage(data);
                alert('Character data imported successfully!');
            } catch (error) {
                console.error('Import error:', error);
                alert('Error importing data: Invalid JSON file');
            }
        };
        reader.readAsText(file);
    }
}

function convertNewFormatToInternal(newFormatData) {
    return {
        characterName: newFormatData.name,
        characterDescription: newFormatData.description,
        characterPortrait: newFormatData.url,
        unlockRequirement: "No requirements", 
        skills: newFormatData.skills.map(skill => {
            const energyObj = {
                taijutsu: 0,
                bloodline: 0,
                ninjutsu: 0,
                genjutsu: 0,
                random: 0
            };
            
            if (skill.energy && Array.isArray(skill.energy)) {
                skill.energy.forEach(energyType => {
                    const type = energyType.toLowerCase();
                    if (energyObj.hasOwnProperty(type)) {
                        energyObj[type]++;
                    }
                });
            }
            
            const classesString = Array.isArray(skill.classes) 
                ? skill.classes.join(', ') 
                : skill.classes || '';
            
            const cooldownString = skill.cooldown === 0 ? "None" : String(skill.cooldown);
            
            return {
                name: skill.name,
                description: skill.description,
                image: skill.url,
                cooldown: cooldownString,
                energy: energyObj,
                classes: classesString
            };
        })
    };
}

function resetToDefault() {
    if (confirm('Are you sure you want to reset to default character data? This will lose all current changes.')) {
        loadDataIntoPage(defaultData);
        alert('Character reset to default!');
    }
}

setInterval(() => {
    const data = getCurrentData();
    localStorage.setItem('characterData_autosave', JSON.stringify(data));
}, 30000);

window.addEventListener('load', () => {
    const savedData = localStorage.getItem('characterData');
    const autoSaveData = localStorage.getItem('characterData_autosave');
    
    if (!savedData && autoSaveData) {
        const shouldLoad = confirm('Found auto-saved data. Would you like to load it?');
        if (shouldLoad) {
            const data = JSON.parse(autoSaveData);
            loadDataIntoPage(data);
        }
    }
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveData();
    } else if (e.ctrlKey && e.key === 'o') {
        e.preventDefault();
        loadData();
    } else if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        exportData();
    } else if (e.key === 'Escape') {
        const modal = document.getElementById('energyModal');
        if (modal.style.display === 'block') {
            closeEnergySelector();
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    function insertPlainTextAtCursor(text) {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        sel.deleteFromDocument();
        const range = sel.getRangeAt(0);
        const node = document.createTextNode(text);
        range.insertNode(node);
        // Move caret to the end of inserted text
        range.setStartAfter(node);
        range.setEndAfter(node);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    function attachEditableHandlers(root = document) {
        const editableElements = root.querySelectorAll('[contenteditable="true"]');
        editableElements.forEach(element => {
            // Mark processed to avoid duplicate listeners
            if (element.__plainPasteBound) return;
            element.__plainPasteBound = true;

            element.addEventListener('input', () => {
                document.title = '* Naruto-Arena Character Creator [BETA]';
            });

            element.addEventListener('paste', (e) => {
                // Force paste as plain text (strip formatting/attributes)
                e.preventDefault();
                const text = (e.clipboardData || window.clipboardData).getData('text') || '';
                insertPlainTextAtCursor(text);
            });
        });
    }

    // Initial bind
    attachEditableHandlers();

    // Initialize drag and drop functionality
    initDragAndDrop();

    // Reinitialize when DOM mutates (e.g., skills added) to bind new editables and DnD
    const observer = new MutationObserver((mutations) => {
        let shouldRefreshDnD = false;
        mutations.forEach(m => {
            m.addedNodes && m.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    attachEditableHandlers(node);
                    if (node.classList && node.classList.contains('charskill')) {
                        shouldRefreshDnD = true;
                    }
                }
            });
        });
        if (shouldRefreshDnD) initDragAndDrop();
    });

    observer.observe(document.querySelector('.character-container'), {
        childList: true,
        subtree: true
    });
});

function createSkillHTML(skill) {
    return `
        &nbsp;Skill:
        <h2 class="skill-name" contenteditable="true">${skill.name}</h2>
        <button class="remove-skill-btn" onclick="removeSkill(this)" title="Remove this skill">&times;</button>
        <div class="dots"></div>
        <div class="skilldescr">
            <img src="${skill.image}" class="pageborda skill-image" align="left" onclick="changeImage(this)">
            <span class="font-fix skill-description" contenteditable="true" style="min-height:83px">
                ${skill.description}
            </span>
        </div>
        <div class="dots"></div>
        <div class="fleft">
            &nbsp;<u class="font-fix">Cooldown:</u> <span class="cooldown" contenteditable="true">${skill.cooldown}</span>
        </div>
        <div class="fright">
            <u class="font-fix energy-required-link" onclick="openEnergySelector(this)">Chakra required:</u>
            <div class="energy-display">
            </div>
        </div>
        <div class="clear"></div>
        <div class="pageinfo fleft">
            &nbsp;Classes: <span class="skill-classes" contenteditable="true">${skill.classes}</span>.
        </div>`;
}

function addNewSkill(isLoading = false) {
    const addSkillContainer = document.querySelector('.add-skill-container');
    const emptySkillSlot = document.querySelector('.charskill.empty-skill');

    const newSkillData = {
        name: "New Skill",
        description: "Enter skill description here.",
        image: "https://i.imgur.com/placeholder.png",
        cooldown: "0",
        classes: "New"
    };

    if (emptySkillSlot) {
        emptySkillSlot.innerHTML = createSkillHTML(newSkillData);
        emptySkillSlot.classList.remove('empty-skill');
        
        const energyDisplay = emptySkillSlot.querySelector('.energy-display');
        energyDisplay.innerHTML = '';

    } else {
        const newSkillElement = document.createElement('div');
        newSkillElement.className = 'charskill';
        newSkillElement.innerHTML = createSkillHTML(newSkillData);
        addSkillContainer.insertAdjacentElement('beforebegin', newSkillElement);
        rebalanceSkillLayout();
    }

    if (!isLoading) {
        document.title = '* Naruto-Arena Character Creator [BETA]';
    }
    initDragAndDrop();
}

function removeSkill(button) {
    const skillElement = button.closest('.charskill');
    const skillName = skillElement.querySelector('.skill-name').textContent;
    
    const confirmed = confirm(`Are you sure you want to remove the skill "${skillName}"?`);
    if (!confirmed) return;
    
    skillElement.innerHTML = '';
    skillElement.classList.add('empty-skill');
    
    rebalanceSkillLayout();
    
    if (!isLoading) {
        document.title = '* Naruto-Arena Character Creator [BETA]';
    }
}

function rebalanceSkillLayout() {
    const skillsContainer = document.querySelector('.character-container center');
    const allSkills = skillsContainer.querySelectorAll('.charskill');
    const addSkillContainer = skillsContainer.querySelector('.add-skill-container');
    
    const clearDivs = skillsContainer.querySelectorAll('.clear');
    clearDivs.forEach(div => {
        if (div.previousElementSibling && div.previousElementSibling.classList.contains('charskill')) {
            div.remove();
        }
    });
    
    allSkills.forEach((skill, index) => {
        if (index % 2 === 1 && index < allSkills.length - 1) {
            const clearDiv = document.createElement('div');
            clearDiv.className = 'clear';
            skill.insertAdjacentElement('afterend', clearDiv);
        }
    });
    
    if (allSkills.length % 2 === 1) {
        const clearDiv = document.createElement('div');
        clearDiv.className = 'clear';
        addSkillContainer.insertAdjacentElement('beforebegin', clearDiv);
    }
}

function loadCharacterImage() {
    const characterContainer = document.querySelector('.character-container');
    const addSkillContainer = document.querySelector('.add-skill-container');
    
    const button = event.target;
    const originalButtonText = button.textContent;
    button.textContent = 'Generating...';
    button.disabled = true;
    
    const originalDisplay = addSkillContainer.style.display;
    addSkillContainer.style.display = 'none';
    
    const removeButtons = characterContainer.querySelectorAll('.remove-skill-btn');
    const originalRemoveButtonDisplays = [];
    removeButtons.forEach((btn, index) => {
        originalRemoveButtonDisplays[index] = btn.style.display;
        btn.style.display = 'none';
    });
    
    const options = {
        quality: 1.0,
        pixelRatio: 1,
        backgroundColor: '#ffffff',
        style: {
            transform: 'scale(1)',
            transformOrigin: 'top left'
        }
    };
    
    htmlToImage.toPng(characterContainer, options)
        .then(function (dataUrl) {
            const newWindow = window.open();
            newWindow.document.write(`
                <html>
                    <head>
                        <title>Character Image</title>
                        <style>
                            body { margin: 0; padding: 20px; background: #f0f0f0; text-align: center; font-family: 'Trebuchet MS', Arial, sans-serif; }
                            img { max-width: 100%; height: auto; border: 1px solid #ccc; background: white; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
                            h2 { color: #280092; margin-bottom: 20px; }
                            button { 
                                font-family: 'Trebuchet MS', Arial, sans-serif;
                                font-size: 11px;
                                padding: 8px 16px;
                                background-color: #0066cc;
                                color: white;
                                border: none;
                                cursor: pointer;
                                margin: 0 5px;
                                transition: background-color 0.2s;
                            }
                            button:hover { background-color: #0052a3; }
                        </style>
                    </head>
                    <body>
                        <h2>Character Image</h2>
                        <img src="${dataUrl}" alt="Character Image" />
                        <br><br>
                        <button onclick="window.close()">Close</button>
                        <button onclick="downloadImage()">Download Image</button>
                        <script>
                            function downloadImage() {
                                const link = document.createElement('a');
                                const characterName = document.querySelector('img').alt || 'character';
                                link.download = characterName.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
                                link.href = '${dataUrl}';
                                link.click();
                            }
                        </script>
                    </body>
                </html>
            `);
            
            button.textContent = originalButtonText;
            button.disabled = false;
            addSkillContainer.style.display = originalDisplay;
            
            removeButtons.forEach((btn, index) => {
                btn.style.display = originalRemoveButtonDisplays[index];
            });
        })
        .catch(function (error) {
            console.error('Error generating image:', error);
            alert('Error generating image. Please try again.');
            
            button.textContent = originalButtonText;
            button.disabled = false;
            addSkillContainer.style.display = originalDisplay;
            
            removeButtons.forEach((btn, index) => {
                btn.style.display = originalRemoveButtonDisplays[index];
            });
        });
}

function toggleSkillGlossary() {
    const glossary = document.getElementById('skillGlossary');
    if (glossary.style.display === 'none' || glossary.style.display === '') {
        glossary.style.display = 'block';
        document.getElementById('glossarySearch').value = '';
        filterGlossary();
    } else {
        glossary.style.display = 'none';
    }
}

function filterGlossary() {
    const searchTerm = document.getElementById('glossarySearch').value.toLowerCase();
    const sections = document.querySelectorAll('.glossary-section');
    
    sections.forEach(section => {
        const header = section.querySelector('h4');
        const items = section.querySelectorAll('li');
        let hasVisibleItems = false;
        
        const headerMatch = header.textContent.toLowerCase().includes(searchTerm);
        
        items.forEach(item => {
            const itemText = item.textContent.toLowerCase();
            const isVisible = itemText.includes(searchTerm) || headerMatch || searchTerm === '';
            
            item.style.display = isVisible ? 'list-item' : 'none';
            if (isVisible) hasVisibleItems = true;
        });
        
        section.style.display = (hasVisibleItems || headerMatch || searchTerm === '') ? 'block' : 'none';
    });
}

function toggleCharacterInfoGlossary() {
    const glossary = document.getElementById('characterInfoGlossary');
    if (glossary.style.display === 'none' || glossary.style.display === '') {
        glossary.style.display = 'block';
        makeCharacterInfoGlossaryDraggable();
    } else {
        glossary.style.display = 'none';
    }
}

let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

document.addEventListener('DOMContentLoaded', function() {
    const glossary = document.getElementById('skillGlossary');
    const header = glossary.querySelector('.skill-glossary-header');
    
    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    
    function dragStart(e) {
        if (e.target.classList.contains('close-btn')) return;
        
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        
        if (e.target === header || header.contains(e.target)) {
            isDragging = true;
            glossary.classList.add('dragging');
        }
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            xOffset = currentX;
            yOffset = currentY;
            
            const rect = glossary.getBoundingClientRect();
            const maxX = window.innerWidth - rect.width;
            const maxY = window.innerHeight - rect.height;
            
            currentX = Math.max(0, Math.min(currentX, maxX));
            currentY = Math.max(0, Math.min(currentY, maxY));
            
            glossary.style.left = currentX + 'px';
            glossary.style.top = currentY + 'px';
        }
    }
    
    function dragEnd(e) {
        if (isDragging) {
            isDragging = false;
            glossary.classList.remove('dragging');
        }
    }
    
    xOffset = 50;
    yOffset = 50;
});

let isCharacterInfoDragging = false;
let characterInfoCurrentX;
let characterInfoCurrentY;
let characterInfoInitialX;
let characterInfoInitialY;
let characterInfoXOffset = 0;
let characterInfoYOffset = 0;

function makeCharacterInfoGlossaryDraggable() {
    const glossary = document.getElementById('characterInfoGlossary');
    const header = glossary.querySelector('.character-info-glossary-header');
    
    header.addEventListener('mousedown', characterInfoDragStart);
    document.addEventListener('mousemove', characterInfoDrag);
    document.addEventListener('mouseup', characterInfoDragEnd);
    
    function characterInfoDragStart(e) {
        if (e.target.classList.contains('close-btn')) return;
        
        characterInfoInitialX = e.clientX - characterInfoXOffset;
        characterInfoInitialY = e.clientY - characterInfoYOffset;
        
        if (e.target === header || header.contains(e.target)) {
            isCharacterInfoDragging = true;
            glossary.classList.add('dragging');
        }
    }
    
    function characterInfoDrag(e) {
        if (isCharacterInfoDragging) {
            e.preventDefault();
            
            characterInfoCurrentX = e.clientX - characterInfoInitialX;
            characterInfoCurrentY = e.clientY - characterInfoInitialY;
            
            characterInfoXOffset = characterInfoCurrentX;
            characterInfoYOffset = characterInfoCurrentY;
            
            const rect = glossary.getBoundingClientRect();
            const maxX = window.innerWidth - rect.width;
            const maxY = window.innerHeight - rect.height;
            
            characterInfoCurrentX = Math.max(0, Math.min(characterInfoCurrentX, maxX));
            characterInfoCurrentY = Math.max(0, Math.min(characterInfoCurrentY, maxY));
            
            glossary.style.left = characterInfoCurrentX + 'px';
            glossary.style.top = characterInfoCurrentY + 'px';
        }
    }
    
    function characterInfoDragEnd(e) {
        if (isCharacterInfoDragging) {
            isCharacterInfoDragging = false;
            glossary.classList.remove('dragging');
        }
    }
    
    characterInfoXOffset = 100;
    characterInfoYOffset = 100;
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function() {
            showCopyFeedback(text);
        }).catch(function(err) {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyFeedback(text);
    } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy to clipboard. Please copy manually: ' + text);
    }
    
    document.body.removeChild(textArea);
}

function showCopyFeedback(text) {
    const feedback = document.createElement('div');
    feedback.textContent = `Copied: ${text}`;
    feedback.style.position = 'fixed';
    feedback.style.top = '20px';
    feedback.style.right = '20px';
    feedback.style.backgroundColor = '#28a745';
    feedback.style.color = 'white';
    feedback.style.padding = '8px 12px';
    feedback.style.borderRadius = '4px';
    feedback.style.fontFamily = 'Trebuchet MS, Arial, sans-serif';
    feedback.style.fontSize = '11px';
    feedback.style.zIndex = '9999';
    feedback.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    feedback.style.transition = 'opacity 0.3s ease';
    
    document.body.appendChild(feedback);
    
    setTimeout(function() {
        feedback.style.opacity = '0';
        setTimeout(function() {
            if (feedback.parentNode) {
                document.body.removeChild(feedback);
            }
        }, 300);
    }, 2000);
}
