// Store the serialized python instance
let gptModel = null;

// Function to initialize the model when the app starts
async function initializeModel() {
  // Await the serialized model from Python
  gptModel = await eel.setup_model()();
  console.log("Initialized model:", gptModel);
};

// Function to send the message to Python and display the result
async function sendMessage() {
  const userInput = document.getElementById("user-input").value;
  if (userInput.trim() !== "") {
    // Display user message in chat
    const userMessageDiv = document.createElement("div");
    userMessageDiv.classList.add("chat-message", "user-message");
    userMessageDiv.innerHTML = marked.parse(userInput);
    document.getElementById("chat-box").appendChild(userMessageDiv);
    document.getElementById("user-input").value = "";  // Clear input field

    // Ensure the model is initialized
    if (!gptModel) {
      console.log("gptModel is null, initializing...");
      await initializeModel();
    }

    // Insert Loader
    const loaderDiv = insertLoader(); 

    // Call Python function, get response and update instance
    try {

      // Wait for Response
      const response = await eel.process_message(userInput, gptModel)();

      // Remove Loader 
      loaderDiv.remove();
      
      // Display Response
      const botMessageDiv = document.createElement("div");
      botMessageDiv.classList.add("chat-message", "user-message");
      botMessageDiv.innerHTML = marked.parse(response.response);
      document.getElementById("chat-box").appendChild(botMessageDiv);
    
      // Replace the old model with the new one returned by Python
      gptModel = response.serialized_model;
      console.log("Updated model:", gptModel);

      // Auto-scroll to the bottom of the chat
      const chatBox = document.getElementById("chat-box");
      chatBox.scrollTop = chatBox.scrollHeight;
    }
    catch (error){
      console.error("Error processing message:", error);
      loaderDiv.remove();
      showToastError("Error Requesting API:Check Console")
    }
  }
};

// Function to refresh the current session
async function refreshSession() {

  // Ensure the model is initialized
  if (!gptModel) {
    console.log("gptModel is null, initializing...");
    await initializeModel();
  }
  eel.refresh_session(gptModel)(function (response) {

    // Replace the old model with the new one returned by Python
    gptModel = response.serialized_model;
    console.log("Updated model:", gptModel);

    // Clear Chat Box
    document.getElementById("chat-box").innerHTML = "";
  });

  // Display Message
  showToast("Session Refreshed !")
};

// Function to reset the model with specified settings
async function changeSettings() {

  // Ensure the model is initialized
  if (!gptModel) {
    console.log("gptModel is null, initializing...");
    await initializeModel();
  }

  // Get settings from HTML elements
  const model = document.getElementById("model_select").value;
  const sysMsg = document.getElementById("system_message").value;
  const maxContext = document.getElementById("max_context").value;

  // List of valid models
  const validModels = ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'];

  // Verification for model selection
  if (!validModels.includes(model)) {
    alert(`Invalid model selection. Please choose from: ${validModels.join(', ')}`);
    return;
  }

  // Verification for system message (textarea)
  if (sysMsg.trim() === "") {
    alert("System message cannot be empty. Please enter a valid message.");
    return;
  }

  // Convert maxContext to an integer
  const maxContextInt = parseInt(maxContext, 10);

  // Verification for maxContext range (range input)
  if (isNaN(maxContextInt) || maxContextInt < 100 || maxContextInt > 1000000) {
    alert("Max context value is invalid. It must be between 100 and 1,000,000.");
    return;
  }

  console.log("Got Settings:", [model, sysMsg, maxContextInt]);

  // Update model with new settings
  gptModel = await eel.setup_model(model, sysMsg, null, maxContextInt)();
  console.log("Updated Model:", gptModel);

  // Show Success Message
  showToast("Settings Applied !")
};

// Function to get info from the Python backend
async function fetchSessionInfo() {
  try {

    // Ensure the model is initialized
    if (!gptModel) {
      console.log("gptModel is null, initializing...");
      await initializeModel();
    }

    // Get Info
    const response = await eel.get_info(gptModel)();

    // Extract info
    const info = response.info;

    // Format the total price: scientific notation for very large or small values
    const total_price = info.total_price;
    let formattedPrice;
    if (total_price === 0) {
      formattedPrice = total_price.toFixed(2); 
    } else if (total_price < 0.001 || total_price > 1000000) {
      formattedPrice = total_price.toExponential(2); 
    } else {
      formattedPrice = total_price.toFixed(2); 
    }

    // Build the HTML content with the info data
    let htmlContent = `
      <p><strong>Total Price:</strong> $${formattedPrice}</p>
      <p><strong>Input Tokens:</strong> ${info.input_tokens}</p>
      <p><strong>Output Tokens:</strong> ${info.output_tokens}</p>
      <p><strong>Total Tokens:</strong> ${info.total_tokens}</p>
      <p><strong>Request Count:</strong> ${info.request_count}</p>
    `;

    // Insert the HTML content into the container
    document.getElementById("SessionInfoContainer").innerHTML = htmlContent;

    console.log("Info Loaded Sucessfully");
  } catch (error) {
    console.error("Error fetching session info:", error);
  }
};


// Function to populate the selector with session options
async function populateSessionSelector() {
  const selector = document.getElementById("sessionSelector");

  // Ensure the model is initialized
  if (!gptModel) {
    console.log("gptModel is null, initializing...");
    await initializeModel();
  }

  // Clear selector
  selector.innerHTML = "";

  // Check if sessions exist
  if (!gptModel || !gptModel.sessions_info || gptModel.sessions_info.length === 0) {
    const option = document.createElement("option");
    option.value = null
    option.text = "No sessions available"
    selector.appendChild(option)
    selector.disabled = true;
    document.getElementById("show_session_button").disabled = true;
    return;
  }

  // Populate the selector with session options
  selector.disabled = false;
  document.getElementById("show_session_button").disabled = false;
  gptModel.sessions_info.forEach((session, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.text = `Session ${index + 1}`;
    selector.appendChild(option);
  });
};

// Function to display the selected session info
async function displaySelectedSession() {
  const selector = document.getElementById("sessionSelector");
  const selectedIndex = selector.value;

  // Ensure the model is initialized
  if (!gptModel) {
    console.log("gptModel is null, initializing...");
    await initializeModel();
  }

  if (!gptModel || !gptModel.sessions_info || selectedIndex === null) {
    console.log("No session selected or no sessions available.");
    return;
  }

  // Get the selected session from gptModel
  const session = gptModel.sessions_info[selectedIndex];
  console.log("Got Selected Session Info:", session)

  // Format the total price: scientific notation for very large or small values
  const total_price = session.total_price;
  let formattedPrice;
  if (total_price === 0) {
    formattedPrice = total_price.toFixed(2);
  } else if (total_price < 0.001 || total_price > 1000000) {
    formattedPrice = total_price.toExponential(2);
  } else {
    formattedPrice = total_price.toFixed(2);
  }

  // Build HTML content for the selected session
  let htmlContent = `
    <h4>Session ${parseInt(selectedIndex) + 1}</h4>
    <p><strong>Total Price:</strong> $${total_price !== null ? formattedPrice : 'N/A'}</p>
    <p><strong>Input Tokens:</strong> ${session.input_tokens || 'N/A'}</p>
    <p><strong>Output Tokens:</strong> ${session.output_tokens || 'N/A'}</p>
    <p><strong>Total Tokens:</strong> ${session.total_tokens || 'N/A'}</p>
    <p><strong>Request Count:</strong> ${session.request_count || 'N/A'}</p>
    <p><strong>Inputs:</strong><br>
      <button onclick="toggleAccordion('inputsAccordion')">Show Inputs</button>
      <div id="inputsAccordion" style="display:none;">${createAccordion(session.inputs)}</div>
    </p>
    <p><strong>Outputs:</strong><br>
      <button onclick="toggleAccordion('outputsAccordion')">Show Outputs</button>
      <div id="outputsAccordion" style="display:none;">${createAccordion(session.outputs)}</div>
    </p>
  `;

  // Insert the HTML content into the container
  document.getElementById("SelectedSessionContainer").innerHTML = htmlContent;

  console.log(`Displayed Session ${parseInt(selectedIndex) + 1}`);
};

// Function to insert loader into last message of chat box
function insertLoader() {
  const loaderDiv = document.createElement("div");
  loaderDiv.classList.add("chat-message", "bot-message");
  const loader = document.createElement("div");
  loader.classList.add("loader");
  loaderDiv.appendChild(loader);

  // Append the loader message to the chat box
  const chatBox = document.getElementById("chat-box");
  chatBox.appendChild(loaderDiv);

  // Scroll to the bottom of the chat box
  chatBox.scrollTop = chatBox.scrollHeight;

  // Return the loaderDiv so it can be removed later
  return loaderDiv;
};

// Function to show a success message
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;

  // Add the "show" class to make it visible
  toast.classList.add("show");

  // Hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000); 
};

// Function to show an error message
function showToastError(message) {
  const toast = document.getElementById("toastError");
  toast.textContent = message;

  // Add the "show" class to make it visible
  toast.classList.add("show");

  // Hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Function to create accordion to show lists
function createAccordion(array) {
  if (!array || array.length === 0) return '<p>N/A</p>';
  let content = '<ul>';
  array.forEach(item => {
    content += `<li>${item}</li>`;
  });
  content += '</ul>';
  return content;
};

// Function to toggle the visibility of the accordion content
function toggleAccordion(id) {
  const accordion = document.getElementById(id);
  accordion.style.display = (accordion.style.display === "none" || accordion.style.display === "") ? "block" : "none";
}



