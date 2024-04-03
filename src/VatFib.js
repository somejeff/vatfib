class VatFib {
    constructor (config) {
        this.config = {
            gateAssignments: [
                {
                    terminal: "Main"
                }
            ]
        }
        this.flights = {
            arrivals: [],
            departures: []
        }
    }

    setFlights(flights) {
        this.flights = flights
        this.assignGates()
    }

    assignGates() {
        for(let i=0;i<this.flights.arrivals.length;i++) {
            const flight = this.flights.arrivals[i];
            flight.terminal = this.config.gateAssignments[0].terminal
        }
    }
}
module.exports = VatFib;