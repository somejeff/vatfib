const VatFib = require("../VatFib");

describe("Filtered Gates by Callsign", () => {
  const fib = new VatFib({
    terminals: [
      {
        name: "T1",
        gates: [
          {
            callsign: /^ACA\d+/,
            name: "A",
          },
          {
            callsign: /^WJ\d+/,
            name: "B",
          },
          {
            callsign: /^AA\d+/,
            name: "A",
          },
          {
            callsign: /^AA\d+/,
            name: "B",
          },
          {
            name: "C",
          },
        ],
      },
    ],
  });

  it("should return Gate A for ACA flights", () => {
    const departures = [];
    const arrivals = [];
    for (let i = 0; i < 100; i++) {
      departures.push({
        callsign: `ACA${i}`,
      });
      arrivals.push({
        callsign: `ACA${i}`,
      });
    }
    fib.setFlights({ departures, arrivals });

    [...fib.flights.departures, ...fib.flights.arrivals].forEach((flight) => {
      expect(flight.terminal).toBe("T1");
      expect(flight.gate).toBe("A");
    });
  });

  it("should return Gate B for WJ flights", () => {
    const departures = [];
    const arrivals = [];
    for (let i = 0; i < 100; i++) {
      departures.push({
        callsign: `WJ${i}`,
      });
      arrivals.push({
        callsign: `WJ${i}`,
      });
    }
    fib.setFlights({ departures, arrivals });

    [...fib.flights.departures, ...fib.flights.arrivals].forEach((flight) => {
      expect(flight.terminal).toBe("T1");
      expect(flight.gate).toBe("B");
    });
  });

  it("should return Gate A or B for AA flights", () => {
    const departures = [];
    const arrivals = [];
    for (let i = 0; i < 100; i++) {
      departures.push({
        callsign: `AA${i}`,
      });
    }
    fib.setFlights({ departures, arrivals });

    [...fib.flights.departures, ...fib.flights.arrivals].forEach((flight) => {
      expect(flight.terminal).toBe("T1");
      expect(flight.gate).toMatch(/A|B/);
    });
  });

  it("should return Gate C for other flights", () => {
    const departures = [];
    const arrivals = [];
    departures.push({
      callsign: `CF-KMT`,
    });
    fib.setFlights({ departures, arrivals });

    [...fib.flights.departures, ...fib.flights.arrivals].forEach((flight) => {
      expect(flight.terminal).toBe("T1");
      expect(flight.gate).toBe("C");
    });
  });
});

describe("Filtered Terminal and Gates by Callsign and Intl/Domestic", () => {
  const fib = new VatFib({
    terminals: [
      {
        name: "International",
        domestic: false,
        gates: [
          {
            callsign: /^ACA\d+/,
            name: "A{01..09}",
          },
          {
            callsign: /^WJ\d+/,
            name: "A{10..19}",
          },
          {
            callsign: /^AA\d+/,
            name: "A{20..29}",
          },
        ],
      },
      {
        name: "Domestic",
        domestic: true,
        gates: [
          {
            callsign: /^ACA\d+/,
            name: "B{01..09}",
          },
          {
            callsign: /^WJ\d+/,
            name: "B{10..19}",
          },
          {
            callsign: /^AA\d+/,
            name: "B{20..29}",
          },
        ],
      },
    ],
  });

  it("should return T1 A01-09 for ACA Intl flights and T2 B01-09 for ACA Domestic flights", () => {
    const departures = [];
    const arrivals = [];
    for (let i = 0; i < 100; i++) {
      departures.push({
        callsign: `ACA${i}`,
        domestic: Math.random() > 0.5,
      });
      arrivals.push({
        callsign: `ACA${i}`,
        domestic: Math.random() > 0.5,
      });
    }
    fib.setFlights({ departures, arrivals });

    [...fib.flights.departures, ...fib.flights.arrivals].filter(flight=>flight.domestic==false).forEach((flight) => {
      expect(flight.terminal).toBe("International");
      expect(flight.gate).toMatch(/A(0[1-9])/);
    });
    [...fib.flights.departures, ...fib.flights.arrivals].filter(flight=>flight.domestic==true).forEach((flight) => {
      expect(flight.terminal).toBe("Domestic");
      expect(flight.gate).toMatch(/B(0[1-9])/);
    });
  });

  it("should return T1 A11-19 for ACA Intl flights and T2 B11-19 for ACA Domestic flights ", () => {
    const departures = [];
    const arrivals = [];
    for (let i = 0; i < 100; i++) {
      departures.push({
        callsign: `WJ${i}`,
        domestic: Math.random() > 0.5,
      });
      arrivals.push({
        callsign: `WJ${i}`,
        domestic: Math.random() > 0.5,
      });
    }
    fib.setFlights({ departures, arrivals });

    [...fib.flights.departures, ...fib.flights.arrivals].filter(flight=>flight.domestic==false).forEach((flight) => {
      expect(flight.terminal).toBe("International");
      expect(flight.gate).toMatch(/A(1[0-9])/);
    });
    [...fib.flights.departures, ...fib.flights.arrivals].filter(flight=>flight.domestic==true).forEach((flight) => {
      expect(flight.terminal).toBe("Domestic");
      expect(flight.gate).toMatch(/B(1[0-9])/);
    });
  });
});
