
const facilityConfig = [
    { name: 'Clubhouse', rates: [{ startTime: '10:00', endTime: '16:00', rate: 100 }, { startTime: '16:00', endTime: '22:00', rate: 500 }] },
    { name: 'Tennis Court', rates: [{ startTime: '00:00', endTime: '23:59', rate: 50 }] },
  ];

  const bookedSlots = {};

  function calculateBookingAmount(facility, startTime, endTime) {
    const facilityRates = facilityConfig.find((f) => f.name === facility).rates;
    let totalAmount = 0;
    
    // Function to calculate the booking amount for a specific rate and time range
    function calculateRateAmount(rate, rateStartTime, rateEndTime) {
      const bookingStartTime = startTime >= rateStartTime ? startTime : rateStartTime;
      const bookingEndTime = endTime <= rateEndTime ? endTime : rateEndTime;
      const [startHour, startMinute] = bookingStartTime.split(':').map(Number);
      const [endHour, endMinute] = bookingEndTime.split(':').map(Number);
      const bookingHours = endHour - startHour + (endMinute - startMinute) / 60;
      return rate.rate * bookingHours;
    }

    for (const rate of facilityRates) {
      if (startTime < rate.endTime && endTime > rate.startTime) {
        totalAmount += calculateRateAmount(rate, rate.startTime, rate.endTime);
      }
    }

    return totalAmount;
  }

  function isSlotAvailable(facility, date, startTime, endTime) {
    const key = facility + '-' + date + '-' + startTime + '-' + endTime;
    return !bookedSlots[key];
  }

  function isTimeValid(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours >= 10 && hours <= 22;
  }

  function bookFacility() {
    const facility = document.getElementById('facility').value;
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    const isValidTime = isTimeValid(startTime) && isTimeValid(endTime);
    if (!isValidTime) {
      document.getElementById('output').innerText = 'Invalid Time Selection';
      return;
    }

    if (startTime >= endTime) {
      document.getElementById('output').innerText = 'Invalid Time Selection';
      return;
    }

    if (isSlotAvailable(facility, date, startTime, endTime)) {
      const amount = calculateBookingAmount(facility, startTime, endTime);
      const key = facility + '-' + date + '-' + startTime + '-' + endTime;
      bookedSlots[key] = true;
      document.getElementById('output').innerText = 'Booked, Rs. ' + amount;
    } else {
      document.getElementById('output').innerText = 'Booking Failed, Already Booked';
    }
  }
