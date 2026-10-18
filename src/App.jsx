
import React, { useMemo, useState } from "react";
import { Gamepad2, Monitor, Joystick, Check } from "lucide-react";

const steps = [
  {
    number: 1,
    label: "YOUR INFO",
    title: "Personal info",
    subtitle: "Please provide your name, email address, and phone number.",
  },
  {
    number: 2,
    label: "SELECT PLAN",
    title: "Select your plan",
    subtitle: "You have the option of monthly or yearly billing.",
  },
  {
    number: 3,
    label: "ADD-ONS",
    title: "Pick add-ons",
    subtitle: "Add-ons help enhance your gaming experience.",
  },
  {
    number: 4,
    label: "SUMMARY",
    title: "Finishing up",
    subtitle: "Double-check everything looks OK before confirming.",
  },
];

const plans = [
  { id: "arcade", name: "Arcade", monthly: 9, yearly: 90 },
  { id: "advanced", name: "Advanced", monthly: 12, yearly: 120 },
  { id: "pro", name: "Pro", monthly: 15, yearly: 150 },
];

const addons = [
  {
    id: "online",
    name: "Online service",
    description: "Access to multiplayer games",
    monthly: 1,
    yearly: 10,
  },
  {
    id: "storage",
    name: "Larger storage",
    description: "Extra 1TB of cloud save",
    monthly: 2,
    yearly: 20,
  },
  {
    id: "profile",
    name: "Customizable Profile",
    description: "Custom theme on your profile",
    monthly: 2,
    yearly: 20,
  },
];

function PlanIcon({ id }) {
  if (id === "arcade") {
    return (
      <span className="plan-icon arcade">
        <Gamepad2 size={24} />
      </span>
    );
  }

  if (id === "advanced") {
    return (
      <span className="plan-icon advanced">
        <Monitor size={24} />
      </span>
    );
  }

  return (
    <span className="plan-icon pro">
      <Joystick size={24} />
    </span>
  );
}

export default function App() {
  const [step, setStep] = useState(1);

  const [user, setUser] = useState({
    userName: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [planId, setPlanId] = useState("");
  const [yearly, setYearly] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

  const selectedPlan = plans.find((plan) => plan.id === planId);
  const priceKey = yearly ? "yearly" : "monthly";
  const period = yearly ? "yr" : "mo";

  const total = useMemo(() => {
    if (!selectedPlan) return 0;

    const addonTotal = addons
      .filter((addon) => selectedAddons.includes(addon.id))
      .reduce((sum, addon) => sum + addon[priceKey], 0);

    return selectedPlan[priceKey] + addonTotal;
  }, [selectedPlan, selectedAddons, priceKey]);

  function updateUser(event) {
    const { name, value } = event.target;

    setUser((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  }

  function validateCurrentStep() {
    const nextErrors = {};

    if (step === 1) {
      if (!user.userName.trim()) {
        nextErrors.userName = "This field is required";
      }

      if (!user.email.trim()) {
        nextErrors.email = "This field is required";
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email.trim())
      ) {
        nextErrors.email = "Enter a valid email address";
      }

      if (!user.phone.trim()) {
        nextErrors.phone = "This field is required";
      }
    }

    if (step === 2 && !planId) {
      nextErrors.plan = "Please select a plan";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function nextStep() {
    if (!validateCurrentStep()) return;

    setStep((current) => Math.min(4, current + 1));
  }

  function previousStep() {
    setErrors({});
    setStep((current) => Math.max(1, current - 1));
  }

  function toggleAddon(id) {
    setSelectedAddons((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  const sidebar = (
    <aside className="sidebar" aria-label="Form progress">
      <div className="steps-list">
        {steps.map((item) => (
          <div className="step-item" key={item.number}>
            <span
              className={`step-number ${
                step === item.number ? "active" : ""
              }`}
            >
              {item.number}
            </span>

            <span className="step-copy">
              <small className="step-label">Step {item.number}</small>
              <strong>{item.label}</strong>
            </span>
          </div>
        ))}
      </div>
    </aside>
  );

  if (confirmed) {
    return (
      <main className="page-shell">
        <section className="form-card">
          {sidebar}

          <div className="content thankyou" aria-live="polite">
            <div className="thank-icon">
              <Check size={42} />
            </div>

            <h1>Thank You!</h1>

            <p>
              Thanks for confirming your subscription! We hope you have fun
              using our platform. If you ever need support, please feel free
              to email us at{" "}
              <a href="mailto:support@loremgaming.com">
                support@loremgaming.com
              </a>
              .
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="form-card">
        {sidebar}

        <div className="content">
          <header className="heading">
            <h1>{steps[step - 1].title}</h1>
            <p>{steps[step - 1].subtitle}</p>
          </header>

          {/* STEP 1: PERSONAL INFORMATION */}
          {step === 1 && (
            <form
              className="fields"
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                nextStep();
              }}
            >
              {[
                {
                  name: "userName",
                  label: "Name",
                  placeholder: "e.g. Stephen King",
                  type: "text",
                },
                {
                  name: "email",
                  label: "Email Address",
                  placeholder: "e.g. stephenking@lorem.com",
                  type: "email",
                },
                {
                  name: "phone",
                  label: "Phone Number",
                  placeholder: "e.g. +1 234 567 890",
                  type: "tel",
                },
              ].map((field) => (
                <div className="field" key={field.name}>
                  <div className="field-label">
                    <label htmlFor={field.name}>{field.label}</label>

                    {errors[field.name] && (
                      <span className="error">
                        {errors[field.name]}
                      </span>
                    )}
                  </div>

                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={user[field.name]}
                    onChange={updateUser}
                    aria-invalid={Boolean(errors[field.name])}
                    aria-describedby={
                      errors[field.name]
                        ? `${field.name}-error`
                        : undefined
                    }
                  />
                </div>
              ))}

              <div className="actions actions-next-only">
                <button id="next-button" type="submit">
                  Next Step
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: SELECT PLAN */}
          {step === 2 && (
            <div className="step-body">
              <div className="plan-grid">
                {plans.map((plan) => (
                  <button
                    type="button"
                    key={plan.id}
                    className={`plan_card plan_car ${
                      planId === plan.id ? "selected" : ""
                    }`}
                    onClick={() => {
                      setPlanId(plan.id);
                      setErrors({});
                    }}
                    aria-pressed={planId === plan.id}
                  >
                    <PlanIcon id={plan.id} />

                    <span className="plan-details">
                      <strong>{plan.name}</strong>
                      <span>
                        ${plan[priceKey]}/{period}
                      </span>
                      {yearly && <small>2 months free</small>}
                    </span>
                  </button>
                ))}
              </div>

              {errors.plan && (
                <p className="error plan-error" role="alert">
                  {errors.plan}
                </p>
              )}

              <div className="billing">
                <span className={!yearly ? "active" : ""}>Monthly</span>

                <button
                  type="button"
                  className={`switch ${yearly ? "yearly" : ""}`}
                  role="switch"
                  aria-checked={yearly}
                  aria-label="Toggle yearly billing"
                  onClick={() => setYearly((current) => !current)}
                >
                  <i />
                </button>

                <span className={yearly ? "active" : ""}>Yearly</span>
              </div>

              <div className="actions">
                <button
                  type="button"
                  className="back-button"
                  onClick={previousStep}
                >
                  Go Back
                </button>

                <button
                  id="next-button"
                  type="button"
                  onClick={nextStep}
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ADD-ONS */}
          {step === 3 && (
            <div className="step-body">
              <div className="addon-list">
                {addons.map((addon) => {
                  const checked = selectedAddons.includes(addon.id);

                  return (
                    <label
                      key={addon.id}
                      className={`addon_card ${
                        checked ? "selected" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="addon-checkbox"
                        name="addons"
                        value={addon.id}
                        checked={checked}
                        onChange={() => toggleAddon(addon.id)}
                        aria-label={addon.name}
                      />

                      <span className="addon-info">
                        <strong>{addon.name}</strong>
                        <small>{addon.description}</small>
                      </span>

                      <span className="addon-price">
                        +${addon[priceKey]}/{period}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="actions">
                <button
                  type="button"
                  className="back-button"
                  onClick={previousStep}
                >
                  Go Back
                </button>

                <button
                  id="next-button"
                  type="button"
                  onClick={nextStep}
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUMMARY */}
          {step === 4 && (
            <div className="step-body">
              <div className="summary">
                <div className="summary-plan">
                  <div>
                    <strong>
                      {selectedPlan?.name} ({yearly ? "Yearly" : "Monthly"})
                    </strong>

                    <button
                      type="button"
                      className="change"
                      onClick={() => {
                        setErrors({});
                        setStep(2);
                      }}
                    >
                      Change
                    </button>
                  </div>

                  <strong>
                    ${selectedPlan?.[priceKey]}/{period}
                  </strong>
                </div>

                {selectedAddons.length > 0 &&
                  addons
                    .filter((addon) => selectedAddons.includes(addon.id))
                    .map((addon) => (
                      <div className="summary-addon" key={addon.id}>
                        <span>{addon.name}</span>
                        <strong>
                          +${addon[priceKey]}/{period}
                        </strong>
                      </div>
                    ))}
              </div>

              <div className="total">
                <span>Total (per {yearly ? "year" : "month"})</span>
                <strong>
                  +${total}/{period}
                </strong>
              </div>

              <div className="actions">
                <button
                  type="button"
                  className="back-button"
                  onClick={previousStep}
                >
                  Go Back
                </button>

                <button
                  id="next-button"
                  className="confirm-button"
                  type="button"
                  onClick={() => setConfirmed(true)}
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
