//Exercise 3 Part A

const taskInputControl = document.getElementById('task_input_field');
const taskListParentUL = document.getElementById('currently_active_task_list_container');
const taskSubmissionForm = document.getElementById('task_submission_form');

function generateNewListItem(eventInstance) 
{
    eventInstance.preventDefault(); 
    
    const taskDescription = taskInputControl.value.trim();
    
    if (taskDescription === '') 
    {
        taskInputControl.setCustomValidity('Told Ya!');
        taskInputControl.reportValidity();
    }

    const taskLiElement = document.createElement('li');
    taskLiElement.textContent = taskDescription; 

    const removalButton = document.createElement('button');
    removalButton.textContent = 'Remove';
    removalButton.classList.add('task_removal_button_hook'); 
    
    taskLiElement.appendChild(removalButton);

    taskListParentUL.appendChild(taskLiElement);

    taskInputControl.value = '';
}

taskSubmissionForm.addEventListener('submit', generateNewListItem);

taskListParentUL.addEventListener('click', function(clickEvent) 
{
    
    const clickedElement = clickEvent.target.closest('.task_removal_button_hook');

    if (clickedElement) 
    {
        const targetLiElement = clickedElement.closest('li');
        targetLiElement.remove(); 
    }
});

// End of Exercise 3 Part A




// Exercise 3 Part B


const TARGET_USER_ID_UNIQUE = 4; 

function acquireUserRecord(id) 
{
    const userUrl = `https://jsonplaceholder.typicode.com/users/${id}`;
    
    return fetch(userUrl)
           .then(response => {
               if (!response.ok) 
            {
                   throw new Error(`HTTP Error (User): ${response.status}`);
               }
               return response.json(); 
           });
}

function acquirePostsCollection(userId) 
{
    const postsUrl = `https://jsonplaceholder.typicode.com/users/${userId}/posts`;
    
    return fetch(postsUrl)
           .then(response => {
               if (!response.ok) 
               {
                   throw new Error(`HTTP Error (Posts): ${response.status}`);
               }
               return response.json();
           });
}

acquireUserRecord(TARGET_USER_ID_UNIQUE)
    .then(retrievedUserProfile => {
        console.log(`Promise Chain: User Found: ${retrievedUserProfile.name}`);
        
        return acquirePostsCollection(retrievedUserProfile.id) 
               .then(retrievedPostsList => ({ retrievedUserProfile, retrievedPostsList })); 
    })
    .then(dataContainer => {
        console.log(`Promise Chain: Posts Fetched: ${dataContainer.retrievedPostsList.map(p => p.title)}`);
        
        displayFetchedDataInDOM(dataContainer.retrievedUserProfile, dataContainer.retrievedPostsList);
    })
    .catch(error => {
        console.error('PROMISE CHAIN WORKFLOW FAILURE:', error);
    });


async function executeAsyncAwaitWorkflow(id) 
{
    try {
        const userData = await acquireUserRecord(id);
        const postData = await acquirePostsCollection(userData.id);

        console.log(`Async/Await: User Found: ${userData.name}`);
        console.log(`Async/Await: Posts Fetched: ${postData.map(p => p.title)}`);

    } 
    catch (error) 
    {
        console.error('ASYNC/AWAIT WORKFLOW FAILURE:', error);
    }
}

function displayFetchedDataInDOM(userRecord, userPostsArray) {
    const userDetailsSection = document.getElementById('user_profile_section');
    const userPostsSection = document.getElementById('user_posts_data_section');
    
    userDetailsSection.textContent = ''; 
    userPostsSection.textContent = '';

    const profileHeader = document.createElement('h4');
    profileHeader.textContent = `Profile: ${userRecord.name}`;
    userDetailsSection.appendChild(profileHeader);

    const emailParagraph = document.createElement('p');
    emailParagraph.innerHTML = `<strong>Email:</strong> ${userRecord.email}`;
    userDetailsSection.appendChild(emailParagraph);

    const postsListHeader = document.createElement('h5');
    postsListHeader.textContent = "User Post Titles:";
    userPostsSection.appendChild(postsListHeader);
    
    const postsList = document.createElement('ul');
    userPostsArray.forEach(post => {
        const postItem = document.createElement('li');
        postItem.textContent = post.title;
        postsList.appendChild(postItem);
    });
    userPostsSection.appendChild(postsList);
}

// Exercise 3 Part B End