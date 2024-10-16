import {LitElement, html} from 'https://cdn.jsdelivr.net/gh/lit/dist/core/lit-core.min.js';

window.addEventListener('message', event => {
  if (event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormSubmitted') {
    [...document.getElementsByClassName('calc-result')].forEach((r) => r.style.display = "block");
    [...document.getElementsByClassName('hbspt-form')].forEach((r) => r.style.display = "none");
  }
});

export class Howmuchcaniborrow extends LitElement {
  PoundsSterling () {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency', currency: 'GBP',
    });
  }

  static properties = {
    income: {}, interestRate: 4.5, deposit: {}, amount: {},
  };
  

  createRenderRoot () {
    return this;
  }

  render () {
    if (parseFloat(this.income) > 0 && parseFloat(this.interestRate) > 0) {
      this.amount = ((parseFloat(this.income) * parseFloat(this.interestRate)) + parseFloat(this.deposit)).toFixed(0);
    }

    return html`
    <form onsubmit="return false;">
      <h1>How Much Can I Borrow</h1>
      
        <label>Annual Gross Income:</label>
          <input @keyup=${e => this.income = parseFloat(e.target.value) ? parseFloat(e.target.value) : 0} type="text" .value="${this.income || ''}" name="income"/>
       <br>
        <label>Deposit:</label>
          <input @keyup=${e => this.deposit = parseFloat(e.target.value) ? parseFloat(e.target.value) : 0} type="text" .value="${this.deposit}" name="deposit"  />
   
        <div class="calc-result" style="display:none">
          <p>You could borrow: ${this.amount > 0 ? this.PoundsSterling().format(this.amount - this.deposit) : ''}</p>
          <p>To buy a property worth: ${this.amount > 0 ? this.PoundsSterling().format(this.amount) : ''}</p>
        </div>
    
    </form>
    `;
  }
}

export class RepaymentCalculator extends LitElement {

  PoundsSterling () {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency', currency: 'GBP',
    });
  }

  static properties = {
    borrowed: {}, interestRate: {}, term: {}, amount: {},
  };

  calculatePayment (principal, rate, term) {
    rate = rate / 1200
    term = term * 12
    this.amount = principal * (rate * Math.pow((1 + rate), term)) / (Math.pow((1 + rate), term) - 1);
  }

  createRenderRoot () {
    return this;
  }

  render () {
    if (parseFloat(this.borrowed) > 0 && parseFloat(this.interestRate) > 0) {
      this.calculatePayment(this.borrowed, parseFloat(this.interestRate), this.term)
    }

    return html`
    <form onsubmit="return false;">
      <h1>What Will My Repayments Be</h1>
      
        <label>Amount Borrowed:</label>
          <input @keyup=${e => this.borrowed = parseFloat(e.target.value) ? parseFloat(e.target.value) : 0} type="text" .value="${this.borrowed || ''}"/>
      <br>    
        <label>Interest Rate of ${this.interestRate}%:</label>
         <input .value="${this.interestRate}" @change=${e => this.interestRate = parseFloat(e.target.value) ? parseFloat(e.target.value) : 0}>
      <br>
        <label>Term:</label>
          <input @keyup=${e => this.term = parseFloat(e.target.value) ? parseFloat(e.target.value) : 25} type="text" .value="${this.term}" />
   
        <div class="calc-result" style="display:none">
          <p>You will pay approx: ${this.amount > 0 ? this.PoundsSterling().format(this.amount * 12) : ''} per year, that is ${this.amount > 0 ? this.PoundsSterling().format(this.amount) : ''} per month</p>
        </div>
    
    </form>
    `;
  }
}

export class Lbtt extends LitElement {

  PoundsSterling () {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency', currency: 'GBP',
    });
  }

  static properties = {
    price: {}, buyertype: {}, amount: {},
  };

  createRenderRoot () {
    return this;
  }

  getInterestFor (price, isFirstTimeBuyer, isSecondHome) {
    this.amount = 0;

    if (isSecondHome) {
      this.amount = this.amount + (price * 0.06)
    }

    if (price < 145000) {
      return;
    }

    if (isFirstTimeBuyer) {
      if (price < 175000) {
        return;
      }

      if (price > 175000 && price <= 250000) {
        this.amount = this.amount + ((price - 175000) * 0.02)
        return;
      } else {
        this.amount = this.amount + 2100 - 600
      }
    } else {
      if (price > 145000 && price <= 250000) {
        this.amount = this.amount + ((price - 145000) * 0.02)
        return;
      } else {
        this.amount = this.amount + 2100;
      }
    }

    if (price > 250000 && price <= 325000) {
      this.amount = this.amount + ((price - 250000) * 0.05)
      return;
    } else {
      this.amount = this.amount + 3750;
    }

    if (price > 325000 && price <= 750000) {
      this.amount = this.amount + ((price - 325000) * 0.1)
      return;
    } else {
      this.amount = this.amount + 42500;
    }

    if (price > 750000) {
      this.amount = this.amount + ((price - 750000) * 0.12)
    }

    return this.amount;
  }

  render () {
    this.getInterestFor(this.price, (parseInt(this.buyertype) === 1), (parseInt(this.buyertype) === 3))

    return html`
    <form onsubmit="return false;">
      <h1>Land and Buildings Transaction Tax Calculator</h1>
      
        <label>Purchase Price:</label>
          <input @keyup=${e => this.price = parseFloat(e.target.value) ? parseFloat(e.target.value) : 0} type="text" .value="${this.price || ''}"/>
      
      <br>    
        
        <label>Type Of Purchase</label>
        <select .value="${this.buyertype}" @change=${e => this.buyertype = parseFloat(e.target.value) ? parseFloat(e.target.value) : 0}>
          <option ?selected=${this.buyertype === 1} value="1">Main Residential Property - First Time Buyer</option>
          <option ?selected=${this.buyertype === 2} value="2">Main Residential Property - Not First Time Buyer</option>
          <option ?selected=${this.buyertype === 3} value="3">Second Home/ Rental Property/Holiday Home</option>
        </select>
      
      <br>
      
        <p class="calc-result" style="display:none">You will pay approx: ${this.amount > 0 ? this.PoundsSterling().format(this.amount) : '0.00'}</p>
       
    </form>
    `;
  }
}

customElements.define('calc-howmuchcaniborrow', Howmuchcaniborrow);
customElements.define('calc-repayment', RepaymentCalculator);
customElements.define('calc-lbtt', Lbtt);
