const btn = document.getElementById("darkToggle");

if (localStorage.getItem("dark") === "1") {
	document.body.classList.add("dark");
	if (btn) btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

if (btn) {
	btn.addEventListener("click", () => {
		document.body.classList.toggle("dark");
		const isDark = document.body.classList.contains("dark");
		localStorage.setItem("dark", isDark ? "1" : "0");
		btn.innerHTML = isDark
			? '<i class="fa-solid fa-sun"></i>'
			: '<i class="fa-solid fa-moon"></i>';
	});
}
