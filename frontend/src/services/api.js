import axios from "axios";

const API_URL = "http://localhost:5000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const logout = () => {
  // TODO: Implement proper logout functionality (e.g., clear user session, remove token)
  console.log("User logged out");
};

export const createQuestion = async (questionData) => {
  try {
    const response = await axios.post(`${API_URL}/questions`, questionData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
};

export const fetchQuestions = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/questions/feed?userId=${userId}`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

export const fetchAllQuestions = async () => {
  try {
    const response = await axios.get(`${API_URL}/questions/all`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all questions:", error);
    throw error;
  }
};

export const answerQuestion = async (questionId, answerData) => {
  try {
    const response = await axios.post(
      `${API_URL}/questions/${questionId}/answer`,
      answerData,
      { headers: getAuthHeader() }
    );
    if (response.data && response.data.answerId) {
      return response.data;
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    console.error("Error answering question:", error);
    throw error;
  }
};

export const fetchUserNetwork = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/network/${userId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user network:", error);
    throw error;
  }
};

export const fetchUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const sendConnectionRequest = async (
  userId,
  { receiverUsername, note, isPrimary }
) => {
  try {
    const response = await axios.post(
      `${API_URL}/network/${userId}/request`,
      { receiverUsername, note, isPrimary },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending connection request:", error);
    throw error;
  }
};

export const acceptConnectionRequest = async (userId, requestId, isPrimary) => {
  try {
    const response = await axios.put(
      `${API_URL}/network/${userId}/request/${requestId}/accept`,
      { isPrimary },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error accepting connection request:", error);
    throw error;
  }
};

export const declineConnectionRequest = async (userId, requestId) => {
  try {
    const response = await axios.put(
      `${API_URL}/network/${userId}/request/${requestId}/decline`,
      null,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error declining connection request:", error);
    throw error;
  }
};

export const suggestConnection = async (
  userId,
  { user1Username, user2Username, note }
) => {
  try {
    const response = await axios.post(
      `${API_URL}/network/${userId}/suggest`,
      { user1Username, user2Username, note },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error suggesting connection:", error);
    throw error;
  }
};

export const fetchQuestionById = async (questionId) => {
  try {
    const response = await axios.get(`${API_URL}/questions/${questionId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching question:", error);
    throw error;
  }
};

//getting connection tree
export const fetchConnectionTree = async (userId, targetId) => {
  try {
    const response = await axios.get(
      `${API_URL}/network/${userId}/tree/${targetId}`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching connection tree:", error);
    throw error;
  }
};

// Add more API service functions for other endpoints (e.g., questions, network)
