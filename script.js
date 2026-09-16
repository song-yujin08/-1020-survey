const form = document.getElementById("surveyForm");
const steps = [...document.querySelectorAll(".form-step")];
const navItems = [...document.querySelectorAll(".step-item")];
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const sectionCounter = document.getElementById("sectionCounter");
const saveStatus = document.getElementById("saveStatus");
const fileInput = document.getElementById("evidenceFiles");
const fileList = document.getElementById("fileList");
const uploadBox = document.querySelector(".upload-box");
const completeDialog = document.getElementById("completeDialog");

let currentStep = 0;
let lastSubmittedData = null;

const STORAGE_KEY = "survey1020_draft_public_v2";
const SUBMIT_KEY = "survey1020_submissions_public_v2";

// Google Apps Script Web App URL
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwhOK9pXkVF9NcfY8FjioYuky8XBC25ii87thrv08kUXfOHoCrrgPs2H-LJZlpQHfcs/exec";

function showStep(index) {
  currentStep = Math.max(0, Math.min(index, steps.length - 1));

  steps.forEach((step, i) => step.classList.toggle("active", i === currentStep));
  navItems.forEach((item, i) => item.classList.toggle("active", i === currentStep));

  const percent = Math.round((currentStep / (steps.length - 1)) * 100);
  progressFill.style.width = `${percent}%`;
  progressText.textContent = `${percent}%`;
  sectionCounter.textContent = `${currentStep + 1} / ${steps.length}`;

  prevBtn.style.visibility = currentStep === 0 ? "hidden" : "visible";
  nextBtn.classList.toggle("hidden", currentStep === steps.length - 1);
  submitBtn.classList.toggle("hidden", currentStep !== steps.length - 1);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function validateStep() {
  const step = steps[currentStep];
  const required = [...step.querySelectorAll("[required]")];

  step.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));

  for (const input of required) {
    if (input.type === "radio") {
      const checked = step.querySelector(`input[name="${input.name}"]:checked`);
      if (!checked) {
        input.closest(".option-grid")?.classList.add("invalid");
        input.focus();
        return false;
      }
    } else if (input.type === "checkbox") {
      if (!input.checked) {
        input.closest("label")?.classList.add("invalid");
        input.focus();
        return false;
      }
    } else if (!input.value.trim()) {
      input.classList.add("invalid");
      input.focus();
      return false;
    }
  }

  return true;
}

function serializeForm() {
  const data = {};
  const fd = new FormData(form);

  for (const [key, value] of fd.entries()) {
    if (key === "evidenceFiles") continue;
    if (data[key]) {
      data[key] = Array.isArray(data[key]) ? [...data[key], value] : [data[key], value];
    } else {
      data[key] = value;
    }
  }

  const checkboxNames = ["appTriggers", "prePurchase", "shareReasons"];
  checkboxNames.forEach(name => {
    data[name] = [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(i => i.value);
  });

  data.evidenceFiles = [...fileInput.files].map(file => ({
    name: file.name,
    size: file.size,
    type: file.type
  }));

  data.savedAt = new Date().toISOString();
  return data;
}

function saveDraft(showFeedback = false) {
  const data = serializeForm();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  saveStatus.textContent = "방금 저장됨";
  if (showFeedback) {
    saveBtn.textContent = "저장 완료";
    setTimeout(() => (saveBtn.textContent = "임시저장"), 1000);
  }

  setTimeout(() => (saveStatus.textContent = "자동 저장됨"), 1200);
}

function restoreDraft() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const data = JSON.parse(raw);

    Object.entries(data).forEach(([key, value]) => {
      if (["evidenceFiles", "savedAt"].includes(key)) return;
      const fields = [...form.querySelectorAll(`[name="${key}"]`)];

      fields.forEach(field => {
        if (field.type === "checkbox") {
          const list = Array.isArray(value) ? value : [value];
          field.checked = list.includes(field.value);
        } else if (field.type === "radio") {
          field.checked = field.value === value;
        } else if (typeof value === "string") {
          field.value = value;
        }
      });
    });
  } catch (e) {
    console.warn("Draft restore failed:", e);
  }
}

function clearDraft() {
  localStorage.removeItem(STORAGE_KEY);
  form.reset();
  fileList.innerHTML = "";
  showStep(0);
}

function renderFiles() {
  fileList.innerHTML = "";
  [...fileInput.files].forEach(file => {
    const div = document.createElement("div");
    div.className = "file-chip";
    div.innerHTML = `<span>${file.name}</span><span>${formatBytes(file.size)}</span>`;
    fileList.appendChild(div);
  });
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${units[i]}`;
}

function saveSubmission(data) {
  const existing = JSON.parse(localStorage.getItem(SUBMIT_KEY) || "[]");
  existing.push(data);
  localStorage.setItem(SUBMIT_KEY, JSON.stringify(existing));
}

function downloadBlob(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function flattenForCsv(data) {
  const row = {};
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      row[key] = value.map(v => (typeof v === "object" ? JSON.stringify(v) : v)).join(" | ");
    } else if (typeof value === "object" && value !== null) {
      row[key] = JSON.stringify(value);
    } else {
      row[key] = value ?? "";
    }
  });
  return row;
}

function toCsv(data) {
  const flat = flattenForCsv(data);
  const headers = Object.keys(flat);

  const esc = val => `"${String(val).replace(/"/g, '""')}"`;
  return [
    headers.map(esc).join(","),
    headers.map(h => esc(flat[h])).join(",")
  ].join("\n");
}

nextBtn.addEventListener("click", () => {
  if (!validateStep()) return;
  saveDraft();
  showStep(currentStep + 1);
});

prevBtn.addEventListener("click", () => {
  saveDraft();
  showStep(currentStep - 1);
});

saveBtn.addEventListener("click", () => saveDraft(true));

resetBtn.addEventListener("click", () => {
  const ok = confirm("현재 입력한 내용을 모두 지울까요?");
  if (ok) clearDraft();
});

form.addEventListener("input", () => {
  clearTimeout(window.__saveTimer);
  window.__saveTimer = setTimeout(saveDraft, 450);
});

form.addEventListener("change", () => {
  clearTimeout(window.__saveTimer);
  window.__saveTimer = setTimeout(saveDraft, 250);
});


async function sendToGoogleSheets(data) {
  if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL.includes("PASTE_GOOGLE")) {
    throw new Error("Google Apps Script URL is not configured.");
  }

  // text/plain + no-cors avoids browser preflight issues with Apps Script Web Apps.
  // The response is intentionally opaque, but the POST request is delivered.
  await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(data)
  });
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (!validateStep()) return;

  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "제출 중…";

  const data = serializeForm();
  data.submittedAt = new Date().toISOString();

  try {
    await sendToGoogleSheets(data);

    // Keep a local backup as well.
    saveSubmission(data);
    lastSubmittedData = data;
    localStorage.removeItem(STORAGE_KEY);
    completeDialog.showModal();
  } catch (error) {
    console.error(error);
    alert("응답 전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

navItems.forEach(item => {
  item.addEventListener("click", () => {
    const target = Number(item.dataset.step);
    if (target <= currentStep || validateStep()) {
      saveDraft();
      showStep(target);
    }
  });
});

fileInput.addEventListener("change", renderFiles);

["dragenter", "dragover"].forEach(type => {
  uploadBox.addEventListener(type, e => {
    e.preventDefault();
    uploadBox.classList.add("drag");
  });
});

["dragleave", "drop"].forEach(type => {
  uploadBox.addEventListener(type, e => {
    e.preventDefault();
    uploadBox.classList.remove("drag");
  });
});

uploadBox.addEventListener("drop", e => {
  const dt = new DataTransfer();
  [...e.dataTransfer.files].forEach(file => dt.items.add(file));
  fileInput.files = dt.files;
  renderFiles();
  saveDraft();
});

document.getElementById("downloadJson").addEventListener("click", () => {
  if (!lastSubmittedData) return;
  downloadBlob(
    `1020_interview_${Date.now()}.json`,
    JSON.stringify(lastSubmittedData, null, 2),
    "application/json;charset=utf-8"
  );
});

document.getElementById("downloadCsv").addEventListener("click", () => {
  if (!lastSubmittedData) return;
  downloadBlob(
    `1020_interview_${Date.now()}.csv`,
    "\uFEFF" + toCsv(lastSubmittedData),
    "text/csv;charset=utf-8"
  );
});

document.getElementById("closeDialog").addEventListener("click", () => {
  completeDialog.close();
});


// One-time cleanup for legacy local drafts from development/test versions.
// This affects only the current visitor's browser and never other users.
[
  "survey1020_draft_v1",
  "survey1020_submissions_v1"
].forEach(key => localStorage.removeItem(key));

restoreDraft();
showStep(0);
