define([],

    function () {

        /**
         * Timer object.
         * @param runFunc - Function to run
         * @param interval - Run interval in ms.
         * @constructor
         */
        function Timer(runFunc, interval) {
            this.runFunc = runFunc;
            this.timer = null;
            this.interval = interval;
            this.timeInit = null;
        }

        /**
         * Start the timer.
         */
        Timer.prototype.start = function () {
            if (this.timer == null) {
                this.timeInit = (new Date).getTime();
                this.__run();
            }
        };

        /**
         * Stops the timer.
         */
        Timer.prototype.stop = function () {
            clearTimeout(this.timer);
            this.timer = null;
        };

        /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Time loop runner.
         */
        Timer.prototype.__run = function () {
            this.runFunc();
            this.timeInit += this.interval;

            this.timer = setTimeout(
                function () {
                    this.__run()
                }.bind(this),
                this.timeInit - (new Date).getTime()
            );
        };

        // Return "class"
        return Timer
    });