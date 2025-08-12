function updateForm() {
    let type = document.getElementById("qrType").value;
    let form = document.getElementById("formFields");

    if (type === "text") {
        form.innerHTML = `<input type="text" id="textData" placeholder="Enter text or URL">`;
    }
    else if (type === "contact") {
        form.innerHTML = `
            <input type="text" id="contactName" placeholder="Full Name">
            <input type="text" id="contactPhone" placeholder="Phone Number">
            <input type="email" id="contactEmail" placeholder="Email Address">
        `;
    }
    else if (type === "email") {
        form.innerHTML = `
            <input type="email" id="emailTo" placeholder="Recipient Email">
            <input type="text" id="emailSubject" placeholder="Subject">
            <textarea id="emailBody" placeholder="Message"></textarea>
        `;
    }
    else if (type === "phone") {
        form.innerHTML = `<input type="text" id="phoneNumber" placeholder="Enter Phone Number">`;
    }
    else if (type === "file") {
        form.innerHTML = `<input type="text" id="fileLink" placeholder="Paste file or image URL">`;
    }
}

// Set default form on page load
updateForm();

function generateQR() {
    let type = document.getElementById("qrType").value;
    let qrText = "";

    if (type === "text") {
        qrText = document.getElementById("textData").value.trim();
        if (!qrText) return alert("Enter some text or a URL");
        let urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/;
        if (urlPattern.test(qrText) && !qrText.startsWith("http")) {
            qrText = "https://" + qrText;
        }
    }
    else if (type === "contact") {
        let name = document.getElementById("contactName").value.trim();
        let phone = document.getElementById("contactPhone").value.trim();
        let email = document.getElementById("contactEmail").value.trim();
        if (!name || !phone) return alert("Name and phone are required");
        qrText = `MECARD:N:${name};TEL:${phone};EMAIL:${email};;`;
    }
    else if (type === "email") {
        let to = document.getElementById("emailTo").value.trim();
        let subject = encodeURIComponent(document.getElementById("emailSubject").value.trim());
        let body = encodeURIComponent(document.getElementById("emailBody").value.trim());
        if (!to) return alert("Recipient email is required");
        qrText = `mailto:${to}?subject=${subject}&body=${body}`;
    }
    else if (type === "phone") {
        let phone = document.getElementById("phoneNumber").value.trim();
        if (!phone) return alert("Phone number is required");
        qrText = `tel:${phone}`;
    }
    else if (type === "file") {
        let fileLink = document.getElementById("fileLink").value.trim();
        if (!fileLink) return alert("File or image URL is required");
        if (!fileLink.startsWith("http")) {
            fileLink = "https://" + fileLink;
        }
        qrText = fileLink;
    }

    let qrCodeContainer = document.getElementById("qrcode");
    qrCodeContainer.innerHTML = "";
    let downloadBtn = document.getElementById("downloadBtn");
    let shareBtn = document.getElementById("shareBtn");

    let qr = new QRCode(qrCodeContainer, {
        text: qrText,
        width: 200,
        height: 200
    });

    setTimeout(() => {
        let img = qrCodeContainer.querySelector("img");
        if (img) {
            downloadBtn.href = img.src;
            downloadBtn.style.display = "inline-block";
            shareBtn.style.display = "inline-block";
        }
    }, 300);
}

function shareQR() {
    let img = document.querySelector("#qrcode img");
    if (!img) return;

    if (navigator.share) {
        fetch(img.src)
            .then(res => res.blob())
            .then(blob => {
                let file = new File([blob], "qrcode.png", { type: "image/png" });
                navigator.share({
                    files: [file],
                    title: "QR Code",
                    text: "Here’s your QR code"
                }).catch(err => console.log("Share canceled", err));
            });
    } else {
        alert("Sharing not supported in this browser. Please download the QR instead.");
    }
}
