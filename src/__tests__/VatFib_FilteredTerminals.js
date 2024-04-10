const VatFib = require("../VatFib");

describe("Filtered Terminals by Callsign", () => {
  const fib = new VatFib({
    terminals: [
      {
        callsign: /^ACA\d+/,
        name: "T1",
      },
      {
        callsign: /^WJ\d+/,
        name: "T2",
      },
      {
        callsign: /^AA\d+/,
        name: "T1",
      },
      {
        callsign: /^AA\d+/,
        name: "T2",
      },
      { name: "T3" },
    ],
  });

  it("should return T1 for ACA flights", () => {
    // several flights
    const departures = [];
    for (let i = 0; i < 100; i++) {
      departures.push({
        callsign: `ACA${i}`,
        international: true,
      });
    }
    fib.setFlights({ departures });

    // All flights T1 or T3
    fib.flights.departures.forEach((flight) => {
      expect(flight.terminal).toBe("T1");
    });
  });

  it("should return T2 for WJ flights", () => {
    // several flights
    const departures = [];
    for (let i = 0; i < 100; i++) {
      departures.push({
        callsign: `WJ${i}`,
        international: true,
      });
    }
    fib.setFlights({ departures });

    // All flights T1 or T3
    fib.flights.departures.forEach((flight) => {
      expect(flight.terminal).toBe("T2");
    });
  });

  
  it("should return sometimes T1 or T2 for AA flights", () => {
    // several flights
    const departures = [];
    for (let i = 0; i < 100; i++) {
      departures.push({
        callsign: `AA${i}`,
        international: true,
      });
    }
    fib.setFlights({ departures });

    // All flights T1 or T3
    fib.flights.departures.forEach((flight) => {
      expect(flight.terminal).toMatch(/T1|T2/);
    });
  });

  
  it("should return sometimes T3 for other flights", () => {
    // several flights
    const departures = [];
    for (let i = 0; i < 100; i++) {
      departures.push({
        callsign: `N${i}`,
        international: true,
      });
    }
    for (let i = 0; i < 100; i++) {
      departures.push({
        callsign: `C${i}`,
        international: true,
      });
    }
    fib.setFlights({ departures });

    // All flights T1 or T3
    fib.flights.departures.forEach((flight) => {
      expect(flight.terminal).toBe("T3");
    });
  });

});
