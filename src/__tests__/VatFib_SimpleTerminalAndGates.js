const VatFib = require("../VatFib");

describe("Default Terminal and Gate", () => {
  const fib = new VatFib();
  it("should initialize a fib", () => {
    expect(fib).not.toBeNull();
    expect(fib.flights.arrivals.length).toBe(0);
    expect(fib.flights.departures.length).toBe(0);
  });

  it("should accept a basic departure flight and assign the main terminal", () => {
    fib.setFlights({
      departures: [
        {
          callsign: "CF-KMT",
        },
      ],
    });

    fib.flights.departures.forEach((flight) => {
      expect(flight.terminal).toBe("Main");
      expect(flight.gate).toMatch("A");
    });
  });
  it("should accept a basic arrival flight and assign the main terminal", () => {
    fib.setFlights({
      arrivals: [
        {
          callsign: "CF-KMT",
        },
      ],
    });

    fib.flights.arrivals.forEach((flight) => {
      expect(flight.terminal).toBe("Main");
      expect(flight.gate).toMatch("A");
    });
  });

  it("should accept departure and arrival flights and assign the main terminal", () => {
    fib.setFlights({
      departures: [
        {
          callsign: "CF-KMT",
        },
      ],
      arrivals: [
        {
          callsign: "CF-KMT",
        },
      ],
    });

    fib.flights.departures.forEach((flight) => {
      expect(flight.terminal).toBe("Main");
      expect(flight.gate).toMatch("A");
    });
    fib.flights.arrivals.forEach((flight) => {
      expect(flight.terminal).toBe("Main");
      expect(flight.gate).toMatch("A");
    });
  });

  it("should accept a multiple flights and assign the main terminal", () => {
    fib.setFlights({
      departures: [
        {
          callsign: "CF-KMT",
        },
        {
          callsign: "ACA1234",
        },
      ],
      arrivals: [
        {
          callsign: "CF-KMT",
        },
        {
          callsign: "ACA1234",
        },
      ],
    });

    fib.flights.departures.forEach((flight) => {
      expect(flight.terminal).toBe("Main");
      expect(flight.gate).toMatch("A");
    });
    fib.flights.arrivals.forEach((flight) => {
      expect(flight.terminal).toBe("Main");
      expect(flight.gate).toMatch("A");
    });
  });
});

describe("Custom Terminal and Gate", () => {
  const fib = new VatFib({
    terminals: [
      {
        name: "1",
        gates: [
          {
            name: "B",
          },
        ],
      },
    ],
  });

  it("should assign the custom terminal and gate", () => {
    fib.setFlights({
      arrivals: [
        {
          callsign: "CF-KMT",
        },
      ],
    });

    fib.flights.arrivals.forEach((flight) => {
      expect(flight.terminal).toBe("1");
      expect(flight.gate).toMatch("B");
    });
  });
});

describe("Multiple terminals with a default gate", () => {
  const fib = new VatFib({
    terminals: [
      {
        name: "T1",
        gates: [
          {
            name: "A",
          },
        ],
      },
      {
        name: "T2",
        gates: [
          {
            name: "B",
          },
        ],
      },
    ],
  });

  it("should assign the custom terminal and gate", () => {
    fib.setFlights({
      departures: [
        {
          callsign: "F1",
        },
        {
          callsign: "F2",
        },
        {
          callsign: "F3",
        },
      ],
      arrivals: [
        {
          callsign: "F1",
        },
        {
          callsign: "F2",
        },
        {
          callsign: "F3",
        },
      ],
    });

    // All flights gate A or B
    fib.flights.departures.forEach((flight) => {
      expect(flight.terminal).toMatch(/T1|T2/);
      expect(flight.gate).toMatch(/[AB]/);
    });
    fib.flights.arrivals.forEach((flight) => {
      expect(flight.terminal).toMatch(/T1|T2/);
      expect(flight.gate).toMatch(/[AB]/);
    });
  });

  it("should reproduce the same terminal and gate", () => {
    fib.setFlights({
      departures: [
        {
          callsign: "F1",
        },
        {
          callsign: "F2",
        },
        {
          callsign: "F3",
        },
      ],
      arrivals: [
        {
          callsign: "F1",
        },
        {
          callsign: "F2",
        },
        {
          callsign: "F3",
        },
      ],
    });
    /**
     * Reproducibe results
     */

    // capture the data from the firstRun
    const firstRun = fib.flights;
    // set the flights again, but with 1 extra pilot
    fib.setFlights({
      departures: [
        {
          callsign: "F1",
        },
        {
          callsign: "F2",
        },
        {
          callsign: "F3",
        },
        {
          callsign: "F4",
        },
      ],
      arrivals: [
        {
          callsign: "F1",
        },
        {
          callsign: "F2",
        },
        {
          callsign: "F3",
        },
        {
          callsign: "F4",
        },
      ],
    });
    // remove the last flight
    fib.flights.departures.pop();
    fib.flights.arrivals.pop();
    // the first flights should have not changed terminals/gates
    expect(fib.flights).toMatchObject(firstRun);
  });
});

describe("Multiple Gates at the main terminal", () => {
  const fib = new VatFib({
    terminals: [
      {
        name: "T1",
        gates: [
          {
            name: "A",
          },
          {
            name: "B",
          },
        ],
      },
    ],
  });

  it("should assign the custom terminal and gate", () => {
    fib.setFlights({
      departures: [
        {
          callsign: "F1",
        },
        {
          callsign: "F2",
        },
        {
          callsign: "F3",
        },
      ],
      arrivals: [
        {
          callsign: "F1",
        },
        {
          callsign: "F2",
        },
        {
          callsign: "F3",
        },
      ],
    });

    // All flights gate A or B
    fib.flights.departures.forEach((flight) => {
      expect(flight.terminal).toBe("T1");
      expect(flight.gate).toMatch(/[AB]/);
    });
    fib.flights.arrivals.forEach((flight) => {
      expect(flight.terminal).toBe("T1");
      expect(flight.gate).toMatch(/[AB]/);
    });
  });

  it("should reproduce the same terminal and gate", () => {
    fib.setFlights({
      departures: [
        {
          callsign: "F1",
        },
        {
          callsign: "F2",
        },
        {
          callsign: "F3",
        },
      ],
      arrivals: [
        {
          callsign: "F1",
        },
        {
          callsign: "F2",
        },
        {
          callsign: "F3",
        },
      ],
    });
    /**
     * Reproducibe results
     */

    // capture the data from the firstRun
    const firstRun = fib.flights;
    // set the flights again, but with 1 extra pilot
    fib.setFlights({
      departures: [
        {
          callsign: "F1",
        },
        {
          callsign: "F2",
        },
        {
          callsign: "F3",
        },
        {
          callsign: "F4",
        },
      ],
      arrivals: [
        {
          callsign: "F1",
        },
        {
          callsign: "F2",
        },
        {
          callsign: "F3",
        },
        {
          callsign: "F4",
        },
      ],
    });
    // remove the last flight
    fib.flights.departures.pop();
    fib.flights.arrivals.pop();
    // the first flights should have not changed terminals/gates
    expect(fib.flights).toMatchObject(firstRun);
  });
});

describe("Multiple Gates at multiple terminals", () => {
  const fib = new VatFib({
    terminals: [
      {
        name: "T1",
        gates: [
          {
            name: "A",
          },
          {
            name: "B",
          },
        ],
      },
      {
        name: "T2",
        gates: [
          {
            name: "C",
          },
          {
            name: "D",
          },
        ],
      },
    ],
  });

  it("should assign the custom terminal and gate", () => {
    fib.setFlights({
      departures: [
        {
          callsign: "F1",
        },
        {
          callsign: "F2",
        },
        {
          callsign: "F3",
        },
      ],
      arrivals: [
        {
          callsign: "F1",
        },
        {
          callsign: "F2",
        },
        {
          callsign: "F3",
        },
      ],
    });

    // All flights gate A thru D
    fib.flights.departures.forEach((flight) => {
      expect(flight.terminal).toMatch(/T1|T2/);
      expect(flight.gate).toMatch(/[ABCD]/);
    });
    fib.flights.arrivals.forEach((flight) => {
      expect(flight.terminal).toMatch(/T1|T2/);
      expect(flight.gate).toMatch(/[ABCD]/);
    });
  });

  it("should reproduce the same terminal and gate", () => {
    fib.setFlights({
      departures: [
        {
          callsign: "F1",
        },
        {
          callsign: "F2",
        },
        {
          callsign: "F3",
        },
      ],
      arrivals: [
        {
          callsign: "F1",
        },
        {
          callsign: "F2",
        },
        {
          callsign: "F3",
        },
      ],
    });
    /**
     * Reproducibe results
     */

    // capture the data from the firstRun
    const firstRun = fib.flights;
    // set the flights again, but with 1 extra pilot
    fib.setFlights({
      departures: [
        {
          callsign: "F1",
        },
        {
          callsign: "F2",
        },
        {
          callsign: "F3",
        },
        {
          callsign: "F4",
        },
      ],
      arrivals: [
        {
          callsign: "F1",
        },
        {
          callsign: "F2",
        },
        {
          callsign: "F3",
        },
        {
          callsign: "F4",
        },
      ],
    });
    // remove the last flight
    fib.flights.departures.pop();
    fib.flights.arrivals.pop();
    // the first flights should have not changed terminals/gates
    expect(fib.flights).toMatchObject(firstRun);
  });
});

describe("Multiple duplicate terminals and gates", () => {
  it("should allow duplicate terminals", () => {
    const fib = new VatFib({
      terminals: [
        {
          name: "T1",
          gates: [
            {
              name: "A",
            },
          ],
        },
        {
          name: "T1",
          gates: [
            {
              name: "B",
            },
          ],
        },
      ],
    });
    fib.setFlights({
      departures: [
        {
          callsign: "F1",
        },
        {
          callsign: "F2",
        },
        {
          callsign: "F3",
        },
      ],
      arrivals: [
        {
          callsign: "F1",
        },
        {
          callsign: "F2",
        },
        {
          callsign: "F3",
        },
      ],
    });
     // All flights gate A or B at T1
     fib.flights.departures.forEach((flight) => {
      expect(flight.terminal).toMatch("T1");
      expect(flight.gate).toMatch(/[AB]/);
    });
    fib.flights.arrivals.forEach((flight) => {
      expect(flight.terminal).toBe("T1");
      expect(flight.gate).toMatch(/[AB]/);
    });
  });

  it("should allow duplicate gates within a terminal", () => {
    const fib = new VatFib({
      terminals: [
        {
          name: "T1",
          gates: [
            {
              name: "A",
            },
            {
              name: "A",
            },
            {
              name: "A",
            },
          ],
        },
      ],
    });
    fib.setFlights({
      departures: [
        {
          callsign: "F1",
        },
        {
          callsign: "F2",
        },
        {
          callsign: "F3",
        },
      ],
      arrivals: [
        {
          callsign: "F1",
        },
        {
          callsign: "F2",
        },
        {
          callsign: "F3",
        },
      ],
    });
     // All flights gate A or B at T1
     fib.flights.departures.forEach((flight) => {
      expect(flight.terminal).toBe("T1");
      expect(flight.gate).toBe("A")
    });
    fib.flights.arrivals.forEach((flight) => {
      expect(flight.terminal).toBe("T1");
      expect(flight.gate).toBe("A")
    });
  });
});
