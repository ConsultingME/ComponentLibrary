({
	displayStep: function (component, helper) {
		var steps = helper.getSteps(component);
		if (steps.length && steps.length > 0) {
			steps.map(function(s) {
				s.set("v.visible", false);
			});
			var currentStepNum = component.get("v.currentStep");
			var min = steps.length, max = 0, currentStep = null;
			for (var x=0; x < steps.length; x++) {
				var sn = steps[x].get("v.stepNumber");
				if (sn < min)
					min = sn;
				else if (sn > max)
					max = sn;
				if (sn == currentStepNum)
					currentStep = steps[x];
			}
			component.set("v.isFirstStep", min == currentStepNum);
			component.set("v.isLastStep", max == currentStepNum);
			currentStep.set("v.visible", true);
		}
	},

	getSteps: function(component) {
		const allSteps = component.find({ instancesOf : "c:CMEWizardStep" });
		var enabledSteps = allSteps.filter(function(s) {
			return s.get("v.enabled") === true;
		});
		return enabledSteps;
	},

	fireStepChangeRequested: function(component, requestedStep) {
		var evt = component.getEvent("onCMEWizardNextStep");
		evt.setParams({currentStep: component.get("v.currentStep"), requestedStep: requestedStep});
		evt.fire();
	},

	fireCancelRequest: function(component) {
		var evt = component.getEvent("onCMEWizardCancel");
		evt.fire();
	},

	initProgressIndicator: function(component) {
		var steps = this.getSteps(component);
		const pi = ["lightning:progressIndicator", {
			"aura:id": "progressIndicator",
			class: component.getReference("v.progressIndicatorClass"),
			currentStep: component.getReference("v.currentStep"),
			hasError: component.getReference("v.hasAlerts"),
			title: component.getReference("v.progressIndicatorTitle"),
			type: component.getReference("v.progressIndicatorType"),
			variant: component.getReference("v.progressIndicatorVariant")
		}];

		var progress = [pi];
		steps.map(function(s) {
			progress.push(["lightning:progressStep", {value: s.get("v.stepNumber")}]);
		});
		$A.createComponents(progress, function(components, status, statusMessagesList) {
			const progInd = components[0];
			progInd.set("v.body", components.slice(1));
			progInd.set("v.currentStep", component.get("v.currentStep"));
			component.set("v.picontainer", progInd);
		});
	},

	close: function (component) {
		component.set("v.visible", false);
	},
	
	processStepChange: function(component, params) {
		if (!params.stopPropagation || null === params.stopPropagation || false === params.stopPropagation) {
			if (params.requestedStep != null) {
				if(params.currentStep < params.requestedStep) {
					var stack = component.get("v.stepStack");
					stack.push(params.currentStep);
					component.set("v.stepStack", stack);
				}
				component.set("v.currentStep", params.requestedStep);
			} else {
				this.close(component);
			}
			var alerts = component.get("v.alerts");
			if (alerts && alerts.length > 0) {
				component.set("v.alerts", []);
			}
		} else {
			component.set("v.alerts", params.alerts);
		}
	},

	initStepCount: function(component) {
		const steps = this.getSteps(component);

		component.set("v.stepCount", steps.length);

		var currentStep = null;
		for(var x=0; x < steps.length; x++) {
			const cs = steps[x].get("v.stepNumber");
			if (currentStep == null) {
				currentStep = cs;
			} else {
				currentStep = cs < currentStep ? cs : currentStep;
			}
		}
		
		component.set("v.currentStep", currentStep);
	},

	removeSteps: function(component, criteria) {
		var body = component.get("v.body");
		var newBody = body.filter(function(c) {
			for(var x = 0; x < criteria.length; x++) {
				if (c.get("v."+criteria[x].attributeName) === criteria[x].value) {
					return false;
				}
			}
			return true;
		});
		component.set("v.body", newBody);
	}
})