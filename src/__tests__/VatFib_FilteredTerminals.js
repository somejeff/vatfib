const { VatFib } = require("../VatFib");

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
    });
  });

  it("should return T2 for WJ flights", () => {
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
      expect(flight.terminal).toBe("T2");
    });
  });

  it("should return sometimes T1 or T2 for AA flights", () => {
    const departures = [];
    const arrivals = [];
    for (let i = 0; i < 100; i++) {
      departures.push({
        callsign: `AA${i}`,
      });
      arrivals.push({
        callsign: `AA${i}`,
      });
    }
    fib.setFlights({ departures, arrivals });

    [...fib.flights.departures, ...fib.flights.arrivals].forEach((flight) => {
      expect(flight.terminal).toMatch(/T1|T2/);
    });
  });

  it("should return sometimes T3 for other flights", () => {
    const departures = [];
    const arrivals = [];
    for (let i = 0; i < 100; i++) {
      departures.push({
        callsign: `N${i}`,
      });
      arrivals.push({
        callsign: `N${i}`,
      });
      departures.push({
        callsign: `C${i}`,
      });
      arrivals.push({
        callsign: `C${i}`,
      });
    }
    fib.setFlights({ departures, arrivals });

    [...fib.flights.departures, ...fib.flights.arrivals].forEach((flight) => {
      expect(flight.terminal).toBe("T3");
    });
  });
});

describe("Filtered Terminals by Intl/Domestic", () => {
  const fib = new VatFib({
    terminals: [
      {
        domestic: false,
        name: "T1",
      },
      {
        domestic: true,
        name: "T2",
      },
      {
        name: "T3",
      },
    ],
  });

  it("should return T1 and T3 for international flights", () => {
    const departures = [];
    const arrivals = [];
    for (let i = 0; i < 100; i++) {
      departures.push({
        callsign: `ACA${Math.random() * 9999}`,
        domestic: false,
      });
      arrivals.push({
        callsign: `ACA${Math.random() * 9999}`,
        domestic: false,
      });
    }
    fib.setFlights({ departures, arrivals });

    [...fib.flights.departures, ...fib.flights.arrivals].forEach((flight) => {
      expect(flight.terminal).toMatch(/T1|T3/);
    });
  });

  it("should return T2 and T3 for domestic flights", () => {
    const departures = [];
    const arrivals = [];
    for (let i = 0; i < 100; i++) {
      departures.push({
        callsign: `ACA${Math.random() * 9999}`,
        domestic: true,
      });
      arrivals.push({
        callsign: `ACA${Math.random() * 9999}`,
        domestic: true
      });
    }
    fib.setFlights({ departures, arrivals });

    [...fib.flights.departures, ...fib.flights.arrivals].forEach((flight) => {
      expect(flight.terminal).toMatch(/T2|T3/);
    });
  });
});

describe("Filtered Terminals by Callsign and Intl/Domestic", () => {
  const fib = new VatFib({
    terminals: [
      {
        name: "T1",
        domestic: false,
        callsign: /^(ACA|WJ|AA)\d+/,
      },
      {
        name: "T2",
        domestic: true,
        callsign: /^(ACA|WJ|AA)\d+/,
      },
      {
        name: "T3",
      },
    ],
  });

  fib.setFlights({
    departures: [
      {
        callsign: "ACA921",
        domestic: true,
      },
      {
        callsign: "ACA1142",
        domestic: false,
      },
    ],
    arrivals: [
      {
        callsign: "WJ123",
        domestic: true,
      },
      {
        callsign: "AA927",
        domestic: false,
      },
      {
        callsign: "CF-KMT",
        domestic: false,
      }
    ],
  });

  it("should return T1 for ACA, WJ and AA international flights", () => {
    expect(fib.flights.departures[1].terminal).toBe("T1")
    expect(fib.flights.arrivals[1].terminal).toBe("T1")
  });

  it("should return T1 for ACA, WJ and AA domestic flights", () => {
    expect(fib.flights.departures[0].terminal).toBe("T2")
    expect(fib.flights.arrivals[0].terminal).toBe("T2")
  });
  
  it("should return T3 for the little guy", () => {
    expect(fib.flights.arrivals[2].terminal).toBe("T3")
  });
  
});
