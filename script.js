
let draggedSkill = null;
let lastDeletedSkill = null;
let lastDeletedSkillIndex = null;

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
        const targetWasEmpty = this.classList.contains('empty-skill');
        const draggedWasEmpty = draggedSkill.classList.contains('empty-skill');

        const draggedHTML = draggedSkill.innerHTML;
        draggedSkill.innerHTML = this.innerHTML;
        this.innerHTML = draggedHTML;

        if (targetWasEmpty && !draggedWasEmpty) {
            this.classList.remove('empty-skill');
            draggedSkill.classList.add('empty-skill');
        } else if (!targetWasEmpty && draggedWasEmpty) {
            this.classList.add('empty-skill');
            draggedSkill.classList.remove('empty-skill');
        }
        
        setupDragEvents(draggedSkill);
        setupDragEvents(this);

        rebalanceSkillLayout();
        
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
    const isEmpty = element.classList.contains('empty-skill');
    element.setAttribute('draggable', isEmpty ? 'false' : 'true');

    element.removeEventListener('dragstart', handleDragStart, false);
    element.removeEventListener('dragenter', handleDragEnter, false);
    element.removeEventListener('dragover', handleDragOver, false);
    element.removeEventListener('dragleave', handleDragLeave, false);
    element.removeEventListener('drop', handleDrop, false);
    element.removeEventListener('dragend', handleDragEnd, false);

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
            energy: { taijutsu: 0, bloodline: 0, ninjutsu: 0, genjutsu: 0, random: 1},
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
                    <h4>Upload Image:</h4>
                    <input type="file" accept="image/*" class="file-input" onchange="openCropperModal(event, this)">
                    <button onclick="this.previousElementSibling.click()" class="upload-btn">Choose File</button>
                    <div class="upload-status"></div>
                </div>
                <div class="upload-divider">OR</div>
                <div class="upload-option">
                    <h4>Enter Image URL:</h4>
                    <input type="text" placeholder="https://example.com/image.jpg" class="url-input" value="${imgElement.src}">
                    <button onclick="openCropperModalFromURL(this)" class="url-btn">Use URL</button>
                </div>
            </div>
            <div class="image-upload-footer">
                <button onclick="this.closest('.image-upload-modal').remove()" class="cancel-btn">Cancel</button>
            </div>
        </div>
    `;
    
    modal.targetImageElement = imgElement;
    document.body.appendChild(modal);
}

function openCropperModal(event, input) {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) return alert('Please select a valid image file.');

    const reader = new FileReader();
    reader.onload = e => launchCropper(e.target.result, input.closest('.image-upload-modal'));
    reader.readAsDataURL(file);
}

function openCropperModalFromURL(button) {
    const urlInput = button.previousElementSibling;
    const imgUrl = urlInput.value.trim();
    if (!imgUrl) return alert('Please enter a valid URL.');

    const testImage = new Image();
    testImage.crossOrigin = 'Anonymous';
    testImage.onload = () => launchCropper(imgUrl, button.closest('.image-upload-modal'));
    testImage.onerror = () => alert('Image failed to load. Please check the URL.');
    testImage.src = imgUrl;
}


function launchCropper(imgSrc, parentModal) {
    const cropperModal = document.createElement('div');
    cropperModal.className = 'cropper-modal';
    cropperModal.innerHTML = `
        <div class="cropper-content">
            <h3>Crop Image (75×75)</h3>
            <div class="crop-area"><canvas id="cropCanvas" width="300" height="300"></canvas></div>
            <input type="range" id="zoomSlider" min="0.5" max="3" step="0.1" value="1" style="width:80%">
            <div class="cropper-controls">
                <button class="cancel-btn" id="cancelCrop">Cancel</button>
                <button class="confirm-btn" id="confirmCrop">Crop & Upload</button>
            </div>
            <div class="upload-status" style="margin-top:10px;"></div>
        </div>
    `;
    document.body.appendChild(cropperModal);

    const canvas = cropperModal.querySelector('#cropCanvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgSrc;

    let posX = canvas.width / 2,
        posY = canvas.height / 2,
        scale = 1,
        dragging = false,
        lastX, lastY;

    img.onload = draw;

    const zoomSlider = cropperModal.querySelector('#zoomSlider');
    zoomSlider.addEventListener('input', e => { scale = parseFloat(e.target.value); draw(); });

    canvas.addEventListener('mousedown', e => { dragging = true; lastX = e.offsetX; lastY = e.offsetY; });
    canvas.addEventListener('mouseup', () => dragging = false);
    canvas.addEventListener('mouseout', () => dragging = false);
    canvas.addEventListener('mousemove', e => {
        if (!dragging) return;
        posX += e.offsetX - lastX;
        posY += e.offsetY - lastY;
        lastX = e.offsetX;
        lastY = e.offsetY;
        draw();
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(posX, posY);
        ctx.scale(scale, scale);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();

        ctx.strokeStyle = "#0066cc";
        ctx.lineWidth = 2;
        ctx.strokeRect((canvas.width - 75) / 2, (canvas.height - 75) / 2, 75, 75);
    }

    cropperModal.querySelector('#cancelCrop').onclick = () => cropperModal.remove();

cropperModal.querySelector('#confirmCrop').onclick = async () => {
    const status = cropperModal.querySelector('.upload-status');
    status.innerHTML = `<div class="upload-progress">Processing & Uploading...</div>`;

    const outCanvas = document.createElement('canvas');
    outCanvas.width = 75;
    outCanvas.height = 75;
    const outCtx = outCanvas.getContext('2d');

    outCtx.save();
    const centerOffsetX = posX - canvas.width / 2;
    const centerOffsetY = posY - canvas.height / 2;
    outCtx.translate(37.5 + centerOffsetX, 37.5 + centerOffsetY);
    outCtx.scale(scale, scale);
    outCtx.drawImage(img, -img.width / 2, -img.height / 2);
    outCtx.restore();

    const blob = await new Promise(res => outCanvas.toBlob(res, 'image/png'));

    const formData = new FormData();
    formData.append('image', blob);
    formData.append('type', 'file');

    try {
        const response = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                'Authorization': 'Client-ID 546c25a59c58ad7'
            },
            body: formData
        });

        const data = await response.json();

        if (data.success && data.data.link) {
            parentModal.targetImageElement.src = data.data.link;
            status.innerHTML = '<div class="upload-success">✓ Upload successful!</div>';
            setTimeout(() => {
                cropperModal.remove();
                parentModal.remove();
            }, 800);
            document.title = '* Naruto-Arena Character Creator [BETA]';
        } else {
            throw new Error(data.data?.error || 'Upload failed');
        }

    } catch (error) {
        console.error('Imgur upload error:', error);
        status.innerHTML = `
            <div class="upload-error">
                Upload failed. Please try again.<br>
                (Server returned: ${error.message})
            </div>
        `;
    }
};
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
        return (text || '').replace(/\s+/g, ' ').trim();
    }

    function getEditableContent(element) {
        if (!element) {
            return { text: '', html: '' };
        }
        return {
            text: cleanText(element.textContent),
            html: element.innerHTML
        };
    }

    const nameElement = document.querySelector('.character-name');
    const descriptionElement = document.querySelector('.character-description');
    const requirementElement = document.querySelector('.unlock-requirement');

    const characterNameContent = getEditableContent(nameElement);
    const characterDescriptionContent = getEditableContent(descriptionElement);
    const unlockRequirementContent = getEditableContent(requirementElement);
    const characterPortrait = document.querySelector('.character-portrait').src;

    const skillElements = document.querySelectorAll('.charskill');
    const skills = [];

    skillElements.forEach(skillElement => {
        if (skillElement.classList.contains('empty-skill')) {
            return;
        }

        const energyDisplay = skillElement.querySelector('.energy-display');
        const energy = {
            taijutsu: energyDisplay ? energyDisplay.querySelectorAll('.energy-square.taijutsu').length : 0,
            bloodline: energyDisplay ? energyDisplay.querySelectorAll('.energy-square.bloodline').length : 0,
            ninjutsu: energyDisplay ? energyDisplay.querySelectorAll('.energy-square.ninjutsu').length : 0,
            genjutsu: energyDisplay ? energyDisplay.querySelectorAll('.energy-square.genjutsu').length : 0,
            random: energyDisplay ? energyDisplay.querySelectorAll('.energy-square.random').length : 0
        };

        const nameContent = getEditableContent(skillElement.querySelector('.skill-name'));
        const descriptionContent = getEditableContent(skillElement.querySelector('.skill-description'));
        const cooldownContent = getEditableContent(skillElement.querySelector('.cooldown'));
        const classesContent = getEditableContent(skillElement.querySelector('.skill-classes'));

        const skill = {
            name: nameContent.text,
            nameHtml: nameContent.html,
            description: descriptionContent.text,
            descriptionHtml: descriptionContent.html,
            image: skillElement.querySelector('.skill-image').src,
            cooldown: cooldownContent.text,
            cooldownHtml: cooldownContent.html,
            energy,
            classes: classesContent.text,
            classesHtml: classesContent.html
        };
        skills.push(skill);
    });

    return {
        characterName: characterNameContent.text,
        characterNameHtml: characterNameContent.html,
        characterDescription: characterDescriptionContent.text,
        characterDescriptionHtml: characterDescriptionContent.html,
        characterPortrait,
        unlockRequirement: unlockRequirementContent.text,
        unlockRequirementHtml: unlockRequirementContent.html,
        skills
    };
}

function applyEditableContent(element, htmlValue, textValue) {
    if (!element) return;
    if (htmlValue !== undefined && htmlValue !== null) {
        element.innerHTML = htmlValue;
    } else if (textValue !== undefined && textValue !== null) {
        element.textContent = textValue;
    } else {
        element.textContent = '';
    }
}

function loadDataIntoPage(data) {
    const nameElement = document.querySelector('.character-name');
    const descriptionElement = document.querySelector('.character-description');
    const portraitElement = document.querySelector('.character-portrait');
    const requirementElement = document.querySelector('.unlock-requirement');

    applyEditableContent(nameElement, data.characterNameHtml, data.characterName);
    applyEditableContent(descriptionElement, data.characterDescriptionHtml, data.characterDescription);
    if (portraitElement && data.characterPortrait) {
        portraitElement.src = data.characterPortrait;
    }
    applyEditableContent(requirementElement, data.unlockRequirementHtml, data.unlockRequirement);
    
    const skillsContainer = document.querySelector('.character-container center');
    const addSkillContainer = document.querySelector('.add-skill-container');
    

    const pageDescription = document.querySelector('.pagedescription');
    let nextElement = pageDescription.nextElementSibling;
    
    while (nextElement && !nextElement.classList.contains('add-skill-container')) {
        const toRemove = nextElement;
        nextElement = nextElement.nextElementSibling;
        toRemove.remove();
    }
    
    (data.skills || []).forEach((skill, index) => {
        const skillNameHtml = (skill && skill.nameHtml !== undefined && skill.nameHtml !== null)
            ? skill.nameHtml
            : (skill && skill.name) || '';
        const skillDescriptionHtml = (skill && skill.descriptionHtml !== undefined && skill.descriptionHtml !== null)
            ? skill.descriptionHtml
            : (skill && skill.description) || '';
        const skillCooldownHtml = (skill && skill.cooldownHtml !== undefined && skill.cooldownHtml !== null)
            ? skill.cooldownHtml
            : (skill && skill.cooldown) || '';
        const skillClassesHtml = (skill && skill.classesHtml !== undefined && skill.classesHtml !== null)
            ? skill.classesHtml
            : (skill && skill.classes) || '';

        const skillImage = (skill && skill.image) ? skill.image : 'https://i.imgur.com/placeholder.png';

        const skillHTML = `
            <div class="charskill">
                &nbsp;Skill: 
                <h2 class="skill-name" contenteditable="true">${skillNameHtml}</h2>
                <button class="remove-skill-btn" onclick="removeSkill(this)" title="Remove this skill">&times;</button>
                <div class="dots"></div>
                <div class="skilldescr">
                    <img src="${skillImage}" class="pageborda skill-image" align="left" onclick="changeImage(this)">
                    <span class="font-fix skill-description" contenteditable="true" style="min-height:83px">
                        ${skillDescriptionHtml}
                    </span>
                </div>
                <div class="dots"></div>
                <div class="fleft">
                    &nbsp;<u class="font-fix">Cooldown:</u> <span class="cooldown" contenteditable="true">${skillCooldownHtml}</span>
                </div>
                <div class="fright">
                    <u class="font-fix energy-required-link" onclick="openEnergySelector(this)">Chakra required:</u> 
                    <div class="energy-display">
                    </div>
                </div>
                <div class="clear"></div>
                <div class="pageinfo fleft">
                    &nbsp;Classes: <span class="skill-classes" contenteditable="true">${skillClassesHtml}</span>.
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
    (data.skills || []).forEach((skill, index) => {
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
        nameHtml: data.characterNameHtml,
        description: data.characterDescription,
        descriptionHtml: data.characterDescriptionHtml,
        url: data.characterPortrait,
        unlockRequirement: data.unlockRequirement,
        unlockRequirementHtml: data.unlockRequirementHtml,
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
                nameHtml: skill.nameHtml,
                description: skill.description,
                descriptionHtml: skill.descriptionHtml,
                energy: energyArray,
                classes: classesArray,
                classesHtml: skill.classesHtml,
                cooldown: skill.cooldown === "None" ? 0 : parseInt(skill.cooldown) || 0,
                cooldownHtml: skill.cooldownHtml,
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
    const unlockRequirementText = newFormatData.unlockRequirement || "No requirements";

    return {
        characterName: newFormatData.name || '',
        characterNameHtml: newFormatData.nameHtml !== undefined && newFormatData.nameHtml !== null ? newFormatData.nameHtml : (newFormatData.name || ''),
        characterDescription: newFormatData.description || '',
        characterDescriptionHtml: newFormatData.descriptionHtml !== undefined && newFormatData.descriptionHtml !== null ? newFormatData.descriptionHtml : (newFormatData.description || ''),
        characterPortrait: newFormatData.url,
        unlockRequirement: unlockRequirementText,
        unlockRequirementHtml: newFormatData.unlockRequirementHtml !== undefined && newFormatData.unlockRequirementHtml !== null ? newFormatData.unlockRequirementHtml : unlockRequirementText,
        skills: (newFormatData.skills || []).map(skill => {
            const energyObj = {
                taijutsu: 0,
                bloodline: 0,
                ninjutsu: 0,
                genjutsu: 0,
                random: 0
            };
            
            if (skill && skill.energy && Array.isArray(skill.energy)) {
                skill.energy.forEach(energyType => {
                    const type = String(energyType || '').toLowerCase();
                    if (energyObj.hasOwnProperty(type)) {
                        energyObj[type]++;
                    }
                });
            }
            
            const classesString = Array.isArray(skill && skill.classes) 
                ? skill.classes.join(', ') 
                : (skill && skill.classes) || '';
            
            const rawCooldown = skill ? skill.cooldown : undefined;
            const cooldownString = rawCooldown === 0 ? "None" : String(rawCooldown ?? '');
            const cooldownHtml = skill && skill.cooldownHtml !== undefined && skill.cooldownHtml !== null ? skill.cooldownHtml : cooldownString;
            const classesHtml = skill && skill.classesHtml !== undefined && skill.classesHtml !== null ? skill.classesHtml : classesString;

            const nameHtml = skill && skill.nameHtml !== undefined && skill.nameHtml !== null ? skill.nameHtml : (skill && skill.name) || '';
            const descriptionText = skill && skill.description ? skill.description : '';
            const descriptionHtml = skill && skill.descriptionHtml !== undefined && skill.descriptionHtml !== null ? skill.descriptionHtml : descriptionText;
            
            return {
                name: skill ? skill.name || '' : '',
                nameHtml,
                description: descriptionText,
                descriptionHtml,
                image: skill ? skill.url : '',
                cooldown: cooldownString || '',
                cooldownHtml,
                energy: energyObj,
                classes: classesString,
                classesHtml
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
    } else if (e.ctrlKey && e.key.toLowerCase() === 'z') {
    e.preventDefault();
    restoreDeletedSkill();
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
            if (element.__plainPasteBound) return;
            element.__plainPasteBound = true;

            element.addEventListener('input', () => {
                document.title = '* Naruto-Arena Character Creator [BETA]';
            });

            element.addEventListener('paste', (e) => {
                e.preventDefault();
                const text = (e.clipboardData || window.clipboardData).getData('text') || '';
                insertPlainTextAtCursor(text);
            });
        });
    }

    attachEditableHandlers();

    initDragAndDrop();

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
    const skillNameHtml = (skill && skill.nameHtml !== undefined && skill.nameHtml !== null)
        ? skill.nameHtml
        : (skill && skill.name) || '';
    const skillDescriptionHtml = (skill && skill.descriptionHtml !== undefined && skill.descriptionHtml !== null)
        ? skill.descriptionHtml
        : (skill && skill.description) || '';
    const skillCooldownHtml = (skill && skill.cooldownHtml !== undefined && skill.cooldownHtml !== null)
        ? skill.cooldownHtml
        : (skill && skill.cooldown) || '';
    const skillClassesHtml = (skill && skill.classesHtml !== undefined && skill.classesHtml !== null)
        ? skill.classesHtml
        : (skill && skill.classes) || '';

    const skillImage = (skill && skill.image) ? skill.image : 'https://i.imgur.com/placeholder.png';

    return `
        &nbsp;Skill:
        <h2 class="skill-name" contenteditable="true">${skillNameHtml}</h2>
        <button class="remove-skill-btn" onclick="removeSkill(this)" title="Remove this skill">&times;</button>
        <div class="dots"></div>
        <div class="skilldescr">
            <img src="${skillImage}" class="pageborda skill-image" align="left" onclick="changeImage(this)">
            <span class="font-fix skill-description" contenteditable="true" style="min-height:83px">
                ${skillDescriptionHtml}
            </span>
        </div>
        <div class="dots"></div>
        <div class="fleft">
            &nbsp;<u class="font-fix">Cooldown:</u> <span class="cooldown" contenteditable="true">${skillCooldownHtml}</span>
        </div>
        <div class="fright">
            <u class="font-fix energy-required-link" onclick="openEnergySelector(this)">Chakra required:</u>
            <div class="energy-display">
            </div>
        </div>
        <div class="clear"></div>
        <div class="pageinfo fleft">
        &nbsp;Classes: <span class="skill-classes" contenteditable="true">${skillClassesHtml}</span>.
        </div>`;
}

function createEmptySkillSlot() {
    const emptySkillElement = document.createElement('div');
    emptySkillElement.className = 'charskill empty-skill';
    emptySkillElement.innerHTML = `
        <div class="empty-skill-placeholder">
            <strong class="empty-skill-title">Empty Skill Slot</strong>
            <span class="empty-skill-instructions">Drag a skill here or click "Add Skill".</span>
        </div>
    `;
    return emptySkillElement;
}

function addNewSkill(isLoading = false) {
    const addSkillContainer = document.querySelector('.add-skill-container');
    const emptySkillSlot = document.querySelector('.charskill.empty-skill');

    const newSkillData = {
        name: "New Skill",
        nameHtml: "New Skill",
        description: "Enter skill description here.",
        descriptionHtml: "Enter skill description here.",
        image: "https://i.imgur.com/placeholder.png",
        cooldown: "0",
        cooldownHtml: "0",
        classes: "New",
        classesHtml: "New"
    };

    if (emptySkillSlot) {
        emptySkillSlot.innerHTML = createSkillHTML(newSkillData);
        emptySkillSlot.classList.remove('empty-skill');
        
        const energyDisplay = emptySkillSlot.querySelector('.energy-display');
        energyDisplay.innerHTML = '';

        rebalanceSkillLayout();

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

showConfirmPopup(`Are you sure you want to remove the skill "<strong>${skillName}</strong>"?`, () => {
    lastDeletedSkill = skillElement.cloneNode(true);
    const allSkills = Array.from(document.querySelectorAll('.charskill'));
    lastDeletedSkillIndex = allSkills.indexOf(skillElement);

    const emptySlot = createEmptySkillSlot();
    skillElement.replaceWith(emptySlot);
    rebalanceSkillLayout();
    initDragAndDrop();
    showUndoPopup(skillName);
    document.title = '* Naruto-Arena Character Creator [BETA]';
});

function rebalanceSkillLayout() {
    const skillsContainer = document.querySelector('.character-container center');
    if (!skillsContainer) return;

    skillsContainer.querySelectorAll('.clear').forEach(div => div.remove());

    const allSkills = Array.from(skillsContainer.querySelectorAll('.charskill'))
        .filter(el => el.style.display !== 'none');

    const addSkillContainer = skillsContainer.querySelector('.add-skill-container');

    allSkills.forEach((skill, index) => {
        if ((index + 1) % 2 === 0) {
            const clearDiv = document.createElement('div');
            clearDiv.className = 'clear';
            skill.insertAdjacentElement('afterend', clearDiv);
        }
    });

    if (allSkills.length % 2 === 1 && addSkillContainer) {
        const clearDiv = document.createElement('div');
        clearDiv.className = 'clear';
        addSkillContainer.insertAdjacentElement('beforebegin', clearDiv);
    }
}
}
function loadCharacterImage() {
    const characterContainer = document.querySelector('.character-container');
    const addSkillContainer = document.querySelector('.add-skill-container');

    const button = event.target;
    const originalButtonText = button.textContent;
    button.textContent = 'Generating...';
    button.disabled = true;

    const originalAddSkillDisplay = addSkillContainer.style.display;
    addSkillContainer.style.display = 'none';

    const removeButtons = characterContainer.querySelectorAll('.remove-skill-btn');
    const originalRemoveButtonDisplays = [];
    removeButtons.forEach((btn, index) => {
        originalRemoveButtonDisplays[index] = btn.style.display;
        btn.style.display = 'none';
    });

    const emptySkillSlots = characterContainer.querySelectorAll('.charskill.empty-skill');
    const originalEmptySkillDisplays = [];
    emptySkillSlots.forEach((slot, i) => {
        originalEmptySkillDisplays[i] = slot.style.display;
        slot.style.display = 'none';
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

        })
        .catch(function (error) {
            console.error('Error generating image:', error);
            alert('Error generating image. Please try again.');
        })
        .finally(() => {
            button.textContent = originalButtonText;
            button.disabled = false;
            addSkillContainer.style.display = originalAddSkillDisplay;

            removeButtons.forEach((btn, index) => {
                btn.style.display = originalRemoveButtonDisplays[index];
            });

            emptySkillSlots.forEach((slot, i) => {
                slot.style.display = originalEmptySkillDisplays[i];
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

function showUndoPopup(skillName) {
    const existingPopup = document.querySelector('.undo-popup');
    if (existingPopup) existingPopup.remove();

    const popup = document.createElement('div');
    popup.className = 'undo-popup';
    popup.innerHTML = `
        <span>Skill "<strong>${skillName}</strong>" deleted.</span>
        <button class="undo-btn">Undo</button>
        <button class="dismiss-btn">Dismiss</button>
    `;

    Object.assign(popup.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#0066cc',
        color: 'white',
        padding: '10px 15px',
        fontSize: '12px',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transition: 'opacity 0.3s ease'
    });

    document.body.appendChild(popup);

    popup.querySelector('.undo-btn').onclick = () => {
        restoreDeletedSkill();

        if (popup.parentNode) popup.remove();
    };

    popup.querySelector('.dismiss-btn').onclick = () => {
        popup.style.opacity = '0';
        setTimeout(() => popup.remove(), 300);
    };

    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => {
            if (popup.parentNode) popup.remove();
        }, 300);
    }, 5000);
}

function restoreDeletedSkill() {
    if (!lastDeletedSkill) return;

    const skillsContainer = document.querySelector('.character-container center');
    const allSkills = skillsContainer.querySelectorAll('.charskill');
    const addSkillContainer = document.querySelector('.add-skill-container');

    if (lastDeletedSkillIndex >= allSkills.length) {
        addSkillContainer.insertAdjacentElement('beforebegin', lastDeletedSkill);
    } else if (allSkills[lastDeletedSkillIndex].classList.contains('empty-skill')) {
        allSkills[lastDeletedSkillIndex].replaceWith(lastDeletedSkill);
    } else {
        allSkills[lastDeletedSkillIndex].insertAdjacentElement('beforebegin', lastDeletedSkill);
    }

    rebalanceSkillLayout();
    initDragAndDrop();

    const popup = document.querySelector('.undo-popup');
    if (popup) popup.remove();

    lastDeletedSkill = null;
    lastDeletedSkillIndex = null;

    document.title = '* Naruto-Arena Character Creator [BETA]';
}

function showConfirmPopup(message, onConfirm, onCancel) {
    const existing = document.querySelector('.confirm-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'confirm-modal';
    modal.innerHTML = `
        <div class="confirm-modal-content">
            <div class="confirm-modal-header">
                <h3>Confirmation</h3>
            </div>
            <div class="confirm-modal-body">
                <p>${message}</p>
            </div>
            <div class="confirm-modal-footer">
                <button class="confirm-btn">Yes</button>
                <button class="cancel-btn">No</button>
            </div>
        </div>
    `;

    Object.assign(modal.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: '2000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    });

    const content = modal.querySelector('.confirm-modal-content');
    Object.assign(content.style, {
        backgroundColor: '#fff',
        border: '1px solid #000',
        padding: '15px 20px',
        maxWidth: '300px',
        textAlign: 'center',
        fontFamily: "'Trebuchet MS', Arial, sans-serif",
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
    });

    modal.querySelector('.confirm-modal-header h3').style.margin = '0 0 10px 0';
    modal.querySelector('.confirm-modal-body p').style.margin = '10px 0';
    const footer = modal.querySelector('.confirm-modal-footer');
    footer.style.marginTop = '15px';
    footer.style.display = 'flex';
    footer.style.justifyContent = 'center';
    footer.style.gap = '10px';

    const confirmBtn = modal.querySelector('.confirm-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');


    confirmBtn.addEventListener('click', () => {
        modal.remove();
        onConfirm && onConfirm();
    });


    cancelBtn.addEventListener('click', () => {
        modal.remove();
        onCancel && onCancel();
    });

    document.body.appendChild(modal);
}

window.addEventListener('error', function (e) {
    if (e.message && e.message.includes('rebalanceSkillLayout is not defined')) {
        e.preventDefault(); 
        return false;       
    }
});

function initializeTextToolbar() {
  const toolbar = document.getElementById("text-toolbar");
  if (!toolbar) return;

  let activeEditor = null;
  let keepToolbarVisible = false;

  function positionToolbar(target) {
    const rect = target.getBoundingClientRect();
    const toolbarHeight = toolbar.offsetHeight || 35;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    const top = rect.top + scrollTop - toolbarHeight - 10;
    const left = rect.left + scrollLeft + rect.width / 2 - toolbar.offsetWidth / 2;
    toolbar.style.top = `${Math.max(10, top)}px`;
    toolbar.style.left = `${Math.max(10, left)}px`;
  }

  function bindEditable(el) {
    if (el.__toolbarBound) return;
    el.__toolbarBound = true;

    el.addEventListener("focus", e => {
      activeEditor = e.target;
      positionToolbar(e.target);
      toolbar.style.display = "flex";
    });

    el.addEventListener("input", e => positionToolbar(e.target));
    el.addEventListener("click", e => positionToolbar(e.target));

    el.addEventListener("blur", () => {
      setTimeout(() => {
        if (!keepToolbarVisible) {
          const active = document.activeElement;
          const insideToolbar = active && toolbar.contains(active);
          const insideEditor = active && active.getAttribute("contenteditable") === "true";
          if (!insideToolbar && !insideEditor) {
            toolbar.style.display = "none";
            activeEditor = null;
          }
        }
      }, 150);
    });
  }

  function refreshBindings() {
    document.querySelectorAll('[contenteditable="true"]').forEach(bindEditable);
  }

  refreshBindings();

  const observer = new MutationObserver(mutations => {
    let found = false;
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType === 1 && (node.matches('[contenteditable="true"]') || node.querySelector('[contenteditable="true"]'))) {
          found = true;
        }
      }
    }
    if (found) refreshBindings();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  toolbar.addEventListener("mousedown", e => {
    keepToolbarVisible = true;
    setTimeout(() => keepToolbarVisible = false, 300);
  });

  toolbar.querySelectorAll("button[data-command]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      if (activeEditor) {
        activeEditor.focus();
        document.execCommand(btn.dataset.command, false, null);
        document.title = "* Naruto-Arena Character Creator [BETA]";
      }
    });
  });

  const textColorPicker = document.getElementById("text-color-picker");
  textColorPicker.addEventListener("focus", () => (keepToolbarVisible = true));
  textColorPicker.addEventListener("blur", () => setTimeout(() => (keepToolbarVisible = false), 300));

  textColorPicker.addEventListener("input", e => {
    if (activeEditor) {
      activeEditor.focus();
      document.execCommand("foreColor", false, e.target.value);
      document.title = "* Naruto-Arena Character Creator [BETA]";
    }
  });

const bgColorPicker = document.getElementById("bg-color-picker");
bgColorPicker.addEventListener("focus", () => (keepToolbarVisible = true));
bgColorPicker.addEventListener("blur", () => setTimeout(() => (keepToolbarVisible = false), 300));

bgColorPicker.addEventListener("input", (e) => {
  if (!activeEditor) return;
  const color = e.target.value;
  activeEditor.focus();

  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  let commonAncestor = range.commonAncestorContainer;

  const existingHighlight = commonAncestor.nodeType === 1
    ? commonAncestor.closest(".highlighted-text")
    : commonAncestor.parentElement && commonAncestor.parentElement.closest(".highlighted-text");

  if (existingHighlight) {
    existingHighlight.style.backgroundColor = color;
    return;
  }

  const span = document.createElement("span");
  span.style.backgroundColor = color;
  span.classList.add("highlighted-text");

  try {
    range.surroundContents(span);
  } catch {
    const frag = range.extractContents();
    span.appendChild(frag);
    range.insertNode(span);
  }

  const newRange = document.createRange();
  newRange.selectNodeContents(span);
  newRange.collapse(false);
  selection.removeAllRanges();
  selection.addRange(newRange);

  document.title = "* Naruto-Arena Character Creator [BETA]";
});

  const addNoteBtn = document.getElementById("add-skill-note-btn");
  addNoteBtn.addEventListener("mousedown", e => {
    e.preventDefault();
    if (!activeEditor) return;

    const dots = document.createElement("div");
    dots.className = "dots";

    const skillNote = document.createElement("div");
    skillNote.className = "skill-note";
    skillNote.contentEditable = "true";
    skillNote.innerHTML = "New note...";

    const parent = activeEditor.closest(".charskill, .pagedescription, .font-fix");
    if (parent && parent.parentNode) {
      parent.parentNode.insertBefore(dots, parent.nextSibling);
      dots.after(skillNote);
      bindEditable(skillNote);
      skillNote.focus();
    } else {
      activeEditor.insertAdjacentElement("afterend", dots);
      dots.after(skillNote);
      bindEditable(skillNote);
      skillNote.focus();
    }
  });

  document.addEventListener("keydown", e => {
    if (e.target.classList.contains("skill-note") && e.key === "Enter") {
      e.preventDefault();
      const newNote = document.createElement("div");
      newNote.className = "skill-note";
      newNote.contentEditable = "true";
      newNote.innerHTML = " ";
      e.target.insertAdjacentElement("afterend", newNote);
      bindEditable(newNote);
      newNote.focus();
      document.title = "* Naruto-Arena Character Creator [BETA]";
    }
  });

  window.addEventListener("scroll", () => activeEditor && positionToolbar(activeEditor));
  window.addEventListener("resize", () => activeEditor && positionToolbar(activeEditor));

  document.addEventListener("keydown", e => {
    if (!activeEditor) return;
    const k = e.key.toLowerCase();
    if (e.ctrlKey && k === "b") { e.preventDefault(); document.execCommand("bold"); }
    else if (e.ctrlKey && k === "i") { e.preventDefault(); document.execCommand("italic"); }
    else if (e.ctrlKey && k === "u") { e.preventDefault(); document.execCommand("underline"); }
  });
}

document.addEventListener("DOMContentLoaded", initializeTextToolbar);
