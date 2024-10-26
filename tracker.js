async function requestLocationPermission() {
    const status = await navigator.permissions.query({ name: 'geolocation' });
    if (status.state === 'granted') {
        startTracking();
    } else if (status.state === 'prompt') {
        status.onchange = () => {
            if (status.state === 'granted') startTracking();
        };
    } else {
        alert("Location permission is denied. Please enable it in settings.");
    }
}

function startTracking() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(sendLocation, handleError, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

async function sendLocation(position) {
    const { latitude, longitude, accuracy } = position.coords;
    console.log(`lat : ${latitude}`);
    console.log(`lon : ${longitude}`);
    console.log(`acc : ${accuracy}`);
    await fetch('https://696a-61-245-169-128.ngrok-free.app/api/update-location', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            busId: 'BUS_01',
            latitude,
            longitude,
            accuracy
        })
    });
}

function handleError(error) {
    console.error('Error obtaining location:', error);
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('ServiceWorker registered:', registration);
    }).catch(error => {
        console.log('ServiceWorker registration failed:', error);
    });
}
