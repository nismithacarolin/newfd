const API_BASE = "api";

/* =========================
   FACULTY (MySQL)
   ========================= */

const Storage = {
  // GET faculty from database
  getFaculty: async () => {
    const res = await fetch(`${API_BASE}/getFaculty.php`);
    return await res.json();
  },

  // ADD faculty to database
  addFaculty: async (faculty) => {
    const formData = new FormData();
    Object.keys(faculty).forEach(key => {
      formData.append(key, faculty[key]);
    });

    const res = await fetch(`${API_BASE}/addFaculty.php`, {
      method: "POST",
      body: formData
    });

    return await res.text();
  },

  /* =========================
     BELOW DATA CAN STAY MOCK
     ========================= */

  getDepartments: () => ([
    { id: 1, name: "Computer Science", code: "CS", hod: "Dr. Alan Turing" },
    { id: 2, name: "Information Technology", code: "IT", hod: "Dr. Grace Hopper" },
    { id: 3, name: "Mechanical Engineering", code: "ME", hod: "Dr. Isaac Newton" },
    { id: 4, name: "Civil Engineering", code: "CE", hod: "Dr. Tesla" }
  ]),

  getAnnouncements: () => ([
    { id: 1, text: "Faculty meeting scheduled for next Friday at 10 AM.", date: "2025-12-20" },
    { id: 2, text: "Semester exams will commence from Jan 5th.", date: "2025-12-18" }
  ]),

  getRequests: () => [],

  addRequest: () => alert("Request feature demo only"),

  updateRequestStatus: () => alert("Request feature demo only")
};

/* =========================
   AUTH (TEMP – UI ONLY)
   ========================= */

const Auth = {
  login: (username, password, type) => {
    if (password === "123") {
      localStorage.setItem("currentUser", JSON.stringify({
        role: type,
        name: username
      }));
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  },

  requireAuth: () => {
    if (!localStorage.getItem("currentUser")) {
      window.location.href = "index.html";
    }
  }
};
