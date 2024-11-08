document.addEventListener("DOMContentLoaded", function() {
    const searchButton = document.getElementById('search-btn');
    const usernameInput = document.getElementById('user-input');
    const statsContainer = document.querySelector('.stats-container');
    const easyProgressCircle = document.querySelector('.easy-progress');
    const mediumProgressCircle = document.querySelector('.medium-progress');
    const hardProgressCircle = document.querySelector('.hard-progress');
    const easyLabel = document.getElementById('easy-label');
    const mediumLabel = document.getElementById('medium-label');
    const hardLabel = document.getElementById('hard-label');
    
    function validUsername(username){
        if(username.trim === ""){
            alert('Username cannot be empty');
            return false;   
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;  /*********/
        const isMatching = regex.test(username);
        if(!isMatching){
            alert('Invalid Username');
        }
        return isMatching;
    }

    async function fetchUserDetails(username){
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`

        try{
            searchButton.style.fontSize = '0.4rem'
            searchButton.textContent = 'Searching..';
            searchButton.disabled = true;

            const response = await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch the user details");
            }
            const parsedData = await response.json();
            console.log(parsedData);

            displayUserData(parsedData)
        }
        catch(error){
            statsContainer.innerHTML = '<p>Node data found.</p>'
        }
        finally{
            searchButton.style.fontSize = '0.8rem'
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(total, solved, label, circle){
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved} / ${total}`;
    }

    function displayUserData(userData){
        const totalQuestions = userData.totalQuestions;
        const totalEasyQuestions = userData.totalEasy;
        const totalMediumQuestions = userData.totalMedium;
        const totalHardQuestions = userData.totalHard;
        const totalSolved = userData.totalSolved;
        const easySolved = userData.easySolved;
        const mediumSolved = userData.mediumSolved;
        const hardSolved = userData.hardSolved;
        const progressContainer = document.querySelector('.stats-container')

        progressContainer.style.display = 'block';
        updateProgress(totalEasyQuestions, easySolved, easyLabel, easyProgressCircle)
        updateProgress(totalHardQuestions, hardSolved, hardLabel, mediumProgressCircle)
        updateProgress(totalMediumQuestions, mediumSolved, mediumLabel, hardProgressCircle)

        const stats = document.querySelector('.stats-card');
        const rank = userData.ranking;
        const acceptanceRate = userData.acceptanceRate;
        stats.innerHTML = `<p>Ranking : ${rank}</p> <p>Acceptance Rate : ${acceptanceRate}</p>`
    }

    searchButton.addEventListener('click', function() {
      const username = usernameInput.value;
      console.log(username);
      if(validUsername(username)){
         fetchUserDetails(username)
      }
    });
  });