document.addEventListener('DOMContentLoaded', () => {
    const questPosts = document.querySelectorAll('.quest-post');
    const questModal = document.getElementById('quest-modal');
    const closeModalButton = document.querySelector('.close-button');
    const modalQuestTitle = document.getElementById('modal-quest-title');
    const modalQuestDetails = document.getElementById('modal-quest-details');
    const modalQuestReward = document.getElementById('modal-quest-reward');
    const modalQuestDifficulty = document.getElementById('modal-quest-difficulty');

    
    questPosts.forEach(post => {
        post.addEventListener('click', () => {
            
            const title = post.querySelector('.quest-title').textContent;
            const summary = post.querySelector('.quest-summary').textContent;
            const fullDetailsHtml = post.querySelector('.quest-details-hidden').innerHTML;
            const reward = post.querySelector('.quest-reward').textContent;
            const difficultySpan = post.querySelector('.quest-difficulty');
            const difficulty = difficultySpan.textContent;
            const difficultyClass = Array.from(difficultySpan.classList).find(cls => cls.startsWith('difficulty-'));

            
            modalQuestTitle.textContent = title;
            modalQuestDetails.innerHTML = `<p><strong>Summary:</strong> ${summary}</p>${fullDetailsHtml}`;
            modalQuestReward.textContent = reward;
            modalQuestDifficulty.textContent = difficulty;

            
            modalQuestDifficulty.className = 'quest-difficulty ' + difficultyClass;

            
            questModal.style.display = 'block';
        });
    });

    
    closeModalButton.addEventListener('click', () => {
        questModal.style.display = 'none';
    });

    
    window.addEventListener('click', (event) => {
        if (event.target == questModal) {
            questModal.style.display = 'none';
        }
    });

    
    questPosts.forEach(post => {
        
        const randomRotation = (Math.random() - 0.5) * 5; 
        
        
        const randomPaddingTop = Math.floor(Math.random() * (25 - 15 + 1)) + 15;
        const randomPaddingBottom = Math.floor(Math.random() * (25 - 15 + 1)) + 15;

        
        const randomMarginLeft = Math.floor(Math.random() * 11) - 5;
        const randomMarginRight = Math.floor(Math.random() * 11) - 5;

        post.style.transform = `rotate(${randomRotation}deg)`;
        post.style.paddingTop = `${randomPaddingTop}px`;
        post.style.paddingBottom = `${randomPaddingBottom}px`;
        post.style.marginLeft = `${randomMarginLeft}px`;
        post.style.marginRight = `${randomMarginRight}px`;
    });
});
