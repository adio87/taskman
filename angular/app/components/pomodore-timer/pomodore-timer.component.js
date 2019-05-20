class PomodoreTimerController {
	constructor($interval, Time) {
		'ngInject';

		this.$interval = $interval;
		this.Time = Time;

		this.time = null;
		this.value = 0;

	}

    $onInit(){

    }

    start(){
        this.stop();

        this.time = this.value * 60;
        this.value = 0;
        this.myInterval = this.$interval(() => {
            if (this.time > 0) this.time--;
            else {
                this.stop();
                this.audio();
            }
        }, 1000);
	}

    stop(){
    	if (this.myInterval) this.$interval.cancel(this.myInterval);
    	this.myInterval = null;
	}

	audio(){
        let audio = new Audio('./../audio/timer.wav');
        audio.play();
    }

    preset(min){
	    if (min === undefined || min <= 0) return;
	    this.value = min;
	    this.start();
    }

}

export const PomodoreTimerComponent = {
	templateUrl: './views/app/components/pomodore-timer/pomodore-timer.component.html',
	controller: PomodoreTimerController,
	controllerAs: 'vm',
	bindings: {}
}
