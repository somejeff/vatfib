const VatFib = require("../VatFib");

describe("Out-of-the-box fib", () => {
  const fib = new VatFib();
  it("should initialize a fib", () => {
    expect(fib).not.toBeNull();
    expect(fib.flights.arrivals.length).toBe(0);
    expect(fib.flights.departures.length).toBe(0);
  });

  it("should accept a basic flight and assign the main terminal", () => {
    fib.setFlights({
      arrivals: [
        {
          callsign: "CF-KMT",
        },
      ],
    });
    expect(fib.flights.arrivals.length).toBe(1);
    expect(fib.flights.arrivals[0].terminal).toBe("Main")
  });
});
