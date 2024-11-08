function showProjectDescription(projectId) {
    const projectFile = `project${projectId}.txt`;
    
    fetch(projectFile)
       .then(response => response.text())
       .then(text => {
            const modalBody = document.getElementById('modal-body');
            modalBody.innerHTML = text;
            
            const modal = new bootstrap.Modal(document.getElementById('projectModal'));
            modal.show();
        })
       .catch(error => console.error('Error loading project description:', error));
}



document.getElementById('txtFile').addEventListener('load', function() {
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('description').textContent = e.target.result;
    }
    reader.readAsText(this);
});
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.dataset.id;
            const projectFile = `project${projectId}.txt`;
            
            fetch(projectFile)
                .then(response => response.text())
                .then(text => {
                    const modalBody = document.getElementById('modal-body');
                    modalBody.innerHTML = text;
                    
                    const modal = new bootstrap.Modal(document.getElementById('projectModal'));
                    modal.show();
                })
                .catch(error => console.error('Error loading project description:', error));
        });
    });

    const expertiseSection = document.querySelector('.my-expertise-section');
    expertiseSection.addEventListener('click', function(e) {
        if (e.target.matches('li')) {
            const skill = e.target.textContent;
            showSkillDescription(skill);
        }
    });

    // Close modal on outside click
    document.body.addEventListener('click', (event) => {
        if (!event.target.closest('#projectModal')) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('projectModal'));
            if (modal) {
                modal.hide();
            }
        }
    });
});
function showSkillDescription(skill) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h4>${skill}</h4>
        <p>Here's a brief description of ${skill}:</p>
        <p>Example: ${skill.charAt(0).toUpperCase() + skill.slice(1)} is a fundamental technology in web development.</p>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('projectModal'));
    modal.show();
}

