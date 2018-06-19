({
	doInit: function (component, event, helper) {
		helper.initStepCount(component);
		component.set("v.stepStack", [component.get("v.startStep")]);
		helper.initProgressIndicator(component);
		helper.displayStep(component, helper);
	},

	onStepChanged: function (component, event, helper) {
		helper.displayStep(component, helper);
	},

	onPrevious: function (component, event, helper) {
		var prev = component.get("v.stepStack").pop();
		helper.fireStepChangeRequested(component, prev);
	},

	onNextButton: function (component, event, helper) {
		var currentStep = component.get("v.currentStep");

		var nextStep = null;
		var steps = helper.getSteps(component);
		for(var x = 0; x < steps.length; x++) {
			if (steps[x].get("v.stepNumber") == currentStep) {
				if (!$A.util.isEmpty(steps[x+1])) {
					nextStep = steps[x+1].get("v.stepNumber");
				}
				break;
			}
		}
		helper.fireStepChangeRequested(component, nextStep);
	},

	onStepChangeRequest: function (component, event, helper) {
		console.log('step change request wizard');
		var params = event.getParams();
		helper.processStepChange(component, params);
	},

	onCancelRequest: function(component, event, helper) {
		helper.fireCancelRequest(component);
	},

	onCancel: function(component, event, helper) {
		console.log('cancel request wizard');
		helper.close(component);
	},

	onAddSteps: function (component, event, helper) {
		var body = component.get("v.body");
		Array.prototype.push.apply(body, event.getParam("arguments").steps);
		component.set("v.body", body);
		helper.initStepCount(component);
		helper.initProgressIndicator(component);
	},

	onRemoveSteps: function (component, event, helper) {
		helper.removeSteps(component, event.getParam("arguments").criteria);
		helper.initStepCount(component);
		helper.initProgressIndicator(component);
	},

	onStepEnabledChange: function (component, event, helper) {
		helper.initStepCount(component);
		helper.initProgressIndicator(component);
	}
})