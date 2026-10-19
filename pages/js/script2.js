"use strict";

// start login form submission with api call
const formEl = document.querySelector("#login-form");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const errorMessage = document.querySelector("#error-message");
const submitBtn = document.querySelector("#submit-btn");
const togglePassword = document.querySelector("#toggle-password");
const navToggle = document.querySelector("#nav-toggle");
const navLinks = document.querySelector(".nav-links");
// end variables

// start toggle password visibility
if (togglePassword) {
    togglePassword.addEventListener("click", () => {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        togglePassword.classList.toggle("bx-show");
        togglePassword.classList.toggle("bx-hide");
    });
}
// end toggle password visibility

// start mobile menu toggle
if (navToggle) {
    navToggle.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });
}
// end mobile menu toggle

// start login form submission
formEl.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    errorMessage.style.display = "none";

    // start validation
    if (!username || !password) {
        showError("لطفاً هر دو فیلد را پر کنید.");
        return;
    }

    if (username.length < 3) {
        showError("نام کاربری حداقل ۳ کاراکتر باید باشد.");
        return;
    }

    if (password.length < 4) {
        showError("رمز عبور حداقل ۴ کاراکتر باید باشد.");
        return;
    }
    // end validation

    setLoading(true);

    try {
        const res = await fetch("https://fakestoreapi.com/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        // start check response
        if (!res.ok) {
            if (res.status === 401) {
                throw new Error("نام کاربری یا رمز عبور اشتباه است.");
            } else {
                throw new Error("مشکلی در ارتباط با سرور پیش آمده.");
            }
        }
        // end check response

        const data = await res.json();
        console.log(data);

        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", username);

            showError("✅ ورود موفق! در حال انتقال...");
            errorMessage.style.color = "#4caf50";

            setTimeout(() => {
                // window.location.href = "dashboard.html";
                console.log("ورود موفق - توکن:", data.token);
            }, 1000);
        } else {
            throw new Error("توکن دریافت نشد. دوباره تلاش کنید.");
        }
    } catch (error) {
        console.log(error);
        showError(error.message || "مشکلی پیش آمده. دوباره تلاش کنید.");
        errorMessage.style.color = "#d13639";
    } finally {
        setLoading(false);
    }
});
// end login form submission

// start show error function
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}
// end show error function

// start set loading function
function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.style.opacity = isLoading ? "0.6" : "1";

    if (isLoading) {
        submitBtn.innerHTML = 'در حال ورود...';
    } else {
        submitBtn.innerHTML = 'ورود';
    }
}
// end set loading function

// start check existing token on load
function checkExistingToken() {
    const token = localStorage.getItem("token");
    if (token) {
        console.log("توکن موجود است:", token);
        // window.location.href = "dashboard.html";
    }
}
// end check existing token on load

// start init
document.addEventListener("DOMContentLoaded", () => {
    checkExistingToken();
    console.log("✅ برنامه با موفقیت راه‌اندازی شد!");
});
// end init