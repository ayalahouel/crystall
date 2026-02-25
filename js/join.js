document.addEventListener('DOMContentLoaded', () => {
    const adventurerForm = document.getElementById('adventurer-form');
    const adventurerCardDisplay = document.getElementById('adventurer-card-display');

    
    function loadMembersFromLocalStorage() {
        const membersJson = localStorage.getItem('adventurerMembers');
        return membersJson ? JSON.parse(membersJson) : [];
    }

    
    function saveMembersToLocalStorage(members) {
        localStorage.setItem('adventurerMembers', JSON.stringify(members, null, 2));
    }

    adventurerForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const adventurerName = document.getElementById('adventurerNameInput').value;
        const adventurerAge = parseInt(document.getElementById('adventurerAgeInput').value);
        const adventurerRace = document.getElementById('adventurerRaceInput').value;
        const adventurerGuild = document.getElementById('adventurerGuildInput').value;

        
        const stats = {
            strength: Math.floor(Math.random() * 10) + 5, 
            health: Math.floor(Math.random() * 20) + 50, 
            magicPower: Math.floor(Math.random() * 15) + 10, 
            dexterity: Math.floor(Math.random() * 10) + 5, 
            agility: Math.floor(Math.random() * 10) + 5, 
            luck: Math.floor(Math.random() * 5) + 1, 
        };

        
        let adventurerClass;
        switch (adventurerGuild) {
            case 'Arcane Sages':
                adventurerClass = 'Wizard';
                break;
            case 'Forest Wardens':
                adventurerClass = 'Ranger';
                break;
            case 'Ironforged Scholars':
                adventurerClass = 'Warrior';
                break;
            case 'Shadow Weavers':
                adventurerClass = 'Rogue';
                break;
            case 'Mystic Nomads':
                adventurerClass = 'Cleric';
                break;
            default:
                adventurerClass = 'Adventurer';
        }

        
        
        try {
            const activeSkillsResponse = await fetch('../json/activeskills.json');
            const activeSkillsData = await activeSkillsResponse.json();
            const availableSkills = activeSkillsData.skills;

            
            const adventurerSkills = [];
            const skillsForClass = availableSkills.filter(skill => skill.class.includes(adventurerClass) || skill.class.includes("Any"));

            while (adventurerSkills.length < 3 && skillsForClass.length > 0) {
                const randomIndex = Math.floor(Math.random() * skillsForClass.length);
                
                adventurerSkills.push(skillsForClass[randomIndex].name);
                skillsForClass.splice(randomIndex, 1); 
            }
            
            
            const hp = stats.health * 5;
            const sp = stats.magicPower * 3;

            const newAdventurer = {
                name: adventurerName,
                adventurername: adventurerName, 
                age: adventurerAge,
                race: adventurerRace,
                class: adventurerClass,
                guild: adventurerGuild,
                stats: stats,
                activeSkills: adventurerSkills,
                hp: hp,
                sp: sp,
            };

            
            let members = loadMembersFromLocalStorage();

            
            members.push(newAdventurer);

            
            saveMembersToLocalStorage(members);

            
            displayAdventurerCard(newAdventurer);
            adventurerForm.reset(); 

            
            showMessageBox('Adventurer card forged!');

        } catch (error) {
            console.error('Error during adventurer registration or skill fetching:', error);
            adventurerCardDisplay.innerHTML = `<p class="error-message">An error occurred during registration. Please check your browser console for details.</p>`;
            showMessageBox('An error occurred during registration. Please check your browser console for details.', true);
        }
    });

    function displayAdventurerCard(adventurer) {
        adventurerCardDisplay.innerHTML = `
            <div class="adventurer-card">
                <div class="card-top-left-info">
                    <span class="label">Name</span>
                    <p class="adventurer-name">${adventurer.adventurername}</p>
                    <div class="extra-text">Y/N</div>
                </div>

                <div class="card-top-middle-info">
                    <span class="label">Class</span>
                    <p class="adventurer-class">${adventurer.class}</p>
                    <div class="extra-text">Adventurer+</div>
                </div>

                <div class="card-top-right-info">
                    <span class="label">Guild</span>
                    <p class="adventurer-guild">${adventurer.guild}</p>
                    <div class="extra-text">Axel</div>
                </div>

                <div class="card-hp-sp">
                    <div class="hp-box">HP <br> <span>${adventurer.hp}</span></div>
                    <div class="sp-box">SP <br> <span>${adventurer.sp}</span></div>
                </div>

                <div class="card-lvl">
                    LVL <br> <span>1</span>
                </div>

                <div class="card-lower-header">
                    <p>AGE: ${adventurer.age} cycles</p>
                    <p>RACE: ${adventurer.race}</p>
                    <p>INV: Origin/Virus also known as the code scythe</p>
                </div>

                <div class="card-main-content">
                    <div class="stats-section">
                        <h4 class="section-title">STATS / SKILLS</h4>
                        <ul>
                            <li><strong>Strength:</strong> ${adventurer.stats.strength}</li>
                            <li><strong>Health:</strong> ${adventurer.stats.health}</li>
                            <li><strong>Magic Power:</strong> ${adventurer.stats.magicPower}</li>
                            <li><strong>Dexterity:</strong> ${adventurer.stats.dexterity}</li>
                            <li><strong>Agility:</strong> ${adventurer.stats.agility}</li>
                            <li><strong>Luck:</strong> ${adventurer.stats.luck}</li>
                        </ul>
                    </div>

                    <div class="active-skills-section">
                        <h4 class="section-title">ACTIVE SKILLS</h4>
                        <ul>
                            ${adventurer.activeSkills.map(skill => `<li>${skill}</li>`).join('')}
                            <li>(Time control)</li> <li>(Space control)</li> <li>(other)</li>        </ul>
                    </div>
                </div>

                <div class="card-message">
                    Welcome to the Grove Keepers, ${adventurer.adventurername}!
                </div>

                <div class="dot-deco top-left"></div>
                <div class="dot-deco top-right"></div>
                <div class="dot-deco bottom-left"></div>
                <div class="dot-deco bottom-right"></div>
                <div class="center-circle-deco"></div>
            </div>
        `;
    }

    
    function showMessageBox(message, isError = false) {
        let messageBox = document.getElementById('custom-message-box');
        if (!messageBox) {
            messageBox = document.createElement('div');
            messageBox.id = 'custom-message-box';
            messageBox.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(69, 39, 18, 0.95);
                color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
                z-index: 10000;
                font-family: 'Times New Roman', serif;
                font-size: 1.1em;
                text-align: center;
                max-width: 80%;
                border: 2px solid #a85f32;
            `;
            document.body.appendChild(messageBox);
        }
        messageBox.textContent = message;
        messageBox.style.backgroundColor = isError ? 'rgba(139, 0, 0, 0.95)' : 'rgba(69, 39, 18, 0.95)';
        messageBox.style.display = 'block';

        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 5000); 
    }
});
