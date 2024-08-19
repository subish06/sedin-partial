import { LightningElement, track, wire } from "lwc";
import getInvoiceForecastingData from "@salesforce/apex/invoiceDataSummaryController.getInvoiceForecastingData";
import { loadStyle } from "lightning/platformResourceLoader";
import COLORS from "@salesforce/resourceUrl/COLORS";

export default class InvoiceDataSummary extends LightningElement {
  @track totalHours = 0;
  @track totalAmount = 0;

  @track isCurrencyEnable = false;
  @track currencyValue = null;
  @track financialYearOptions = [];
  @track financialYear = "2024-2025";
  @track startDate = "04/01/2024";
  @track endDate = "03/31/2025";
  @track bDivision = null;
  @track currencyIsoCode;
  @track currConvRate;
  // @track startDate;
  // @track endDate;

  get isCurrencyDisabled() {
    return !this.isCurrencyEnable;
  }

  get businessDivisionOptions() {
    return [
      {
        label: "All",
        value: null
      },
      {
        label: "RF",
        value: "RF"
      },
      {
        label: "ECOM",
        value: "ECOM"
      },
      {
        label: "SALESFORCE",
        value: "SALESFORCE"
      },
      {
        label: "DK",
        value: "DK"
      },
      {
        label: "ENGGA",
        value: "ENGGA"
      },
      {
        label: "EAM",
        value: "EAM"
      },
      {
        label: "ENGGP",
        value: "ENGGP"
      },
      {
        label: "ECM",
        value: "ECM"
      },
      {
        label: "TL",
        value: "TL"
      }
    ];
  }

  get currencyOptions() {
    return [
      {
        label: "AUD",
        value: "AUD"
      },
      {
        label: "CAD",
        value: "CAD"
      },
      {
        label: "INR",
        value: "INR"
      },
      {
        label: "SGD",
        value: "SGD"
      },
      {
        label: "USD",
        value: "USD"
      }
    ];
  }

  @track gridData = [];
  @track rawData = [];

  @track gridColumns = [
    {
      label: "Project Name",
      fieldName: "projectName",
      type: "text",
      initialWidth: 250,
      cellAttributes: { class: { fieldName: "boldStyle" } }
    },
    { label: "Client Name", fieldName: "accountName", type: "text" },
    {
      label: "Business Division",
      fieldName: "businessDivision",
      type: "text"
    },
    {
      label: "Contract",
      fieldName: "contractId",
      type: "url",
      typeAttributes: { label: { fieldName: "contractNumber" } }
    },
    {
      label: "End Date (Contract)",
      fieldName: "contractEndDate",
      type: "date"
    },
    { label: "Billing Role", fieldName: "billingRole", type: "text" },
    // { label: 'Rate', fieldName: 'nonBillableRate', type: 'currency' },
    // { label: 'Hours', fieldName: 'nonBillableHours', type: 'number' },
    { label: "Actual", fieldName: "AprActual", type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Unbilled", fieldName: "AprNonBillable",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Total", fieldName: "AprTotal",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Actual", fieldName: "MayActual",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Unbilled", fieldName: "MayNonBillable",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Total", fieldName: "MayTotal",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Actual", fieldName: "JunActual",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Unbilled", fieldName: "JunNonBillable",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Total", fieldName: "JunTotal",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Actual", fieldName: "JulActual",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Unbilled", fieldName: "JulNonBillable",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Total", fieldName: "JulTotal",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Actual", fieldName: "AugActual",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Unbilled", fieldName: "AugNonBillable",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Total", fieldName: "AugTotal",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Actual", fieldName: "SepActual",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Unbilled", fieldName: "SepNonBillable",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Total", fieldName: "SepTotal",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Actual", fieldName: "OctActual",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Unbilled", fieldName: "OctNonBillable",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Total", fieldName: "OctTotal",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Actual", fieldName: "NovActual",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Unbilled", fieldName: "NovNonBillable",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Total", fieldName: "NovTotal",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Actual", fieldName: "DecActual",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Unbilled", fieldName: "DecNonBillable",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Total", fieldName: "DecTotal",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Actual", fieldName: "JanActual",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Unbilled", fieldName: "JanNonBillable",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Total", fieldName: "JanTotal",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Actual", fieldName: "FebActual",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Unbilled", fieldName: "FebNonBillable",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Total", fieldName: "FebTotal",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Actual", fieldName: "MarActual",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Unbilled", fieldName: "MarNonBillable",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    { label: "Total", fieldName: "MarTotal",  type: 'currency', typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } } },
    {
      label: "Amount",
      fieldName: "Amount",
      type: "currency",
      typeAttributes: { currencyCode: { fieldName: 'currencyIsoCode' } },
      cellAttributes: { class: { fieldName: "boldStyle" } }
    }
  ];

  @wire(getInvoiceForecastingData, {
    startDate: "$startDate",
    endDate: "$endDate",
    bDivision: "$bDivision",
    currencyCode: "$currencyValue"
  })
  wired(result) {
    if (result.data) {
      try {
        console.log("result.data====>" + JSON.stringify(result.data));
        console.log("rawQuoteData====>" + JSON.stringify(result.data?.quoteList.filter((quote) => quote.QuoteLineItems != null)));
        this.rawData = result.data;
        this.currConvRate = result.data.currRate;
        this.rawQuoteData = result.data?.quoteList.filter(
          (quote) => quote.QuoteLineItems != null
        );
        this.rawOrderData = result.data?.orderList.map((order) => {
          return {
            ...order,
            OrderItems: order?.OrderItems?.filter(
              (orderItem) =>
                (order.Engagement_Model__c === "Milestone" &&
                  new Date(orderItem.EndDate) <= new Date(this.endDate)) ||
                order.Engagement_Model__c !== "Milestone"
            )
          };
        });
        // console.log("rawOrderData 113====>" + JSON.stringify(this.rawOrderData));
        this.rawOrderData = this.rawOrderData.filter(
          (order) => order.OrderItems && order.OrderItems.length > 0
        );
        // console.log("rawOrderData 117====>" + JSON.stringify(this.rawOrderData));
        this.gridData = this.rawOrderData.map((order) => {
          return {
            id: order.Id,
            projectName: order.Name,
            accountName: order.Account?.Name,
            startDate: order.EffectiveDate,
            endDate: order.EndDate,
            engagementModel: order.Engagement_Model__c,
            contractId:
              order.ContractId &&
              `https://sedintechnologies--partial.sandbox.lightning.force.com/lightning/r/Contract/${order.ContractId}/view`,
            contractNumber: order.Contract?.ContractNumber,
            contractEndDate: order.Contract?.EndDate,
            businessDivision: order.Business_Division__c,
            currencyIsoCode: this.isCurrencyEnable ? order.CurrencyIsoCode : "USD",
            boldStyle: "bold-text",
            _children: order?.OrderItems?.map((orderItem) => {
              return {
                id: orderItem.Id,
                billingRole: orderItem.Project_Line_Item_Name__c,
                nonBillableRate: this.isCurrencyEnable ? orderItem.UnitPrice : orderItem.UnitPriceConverted__c,
                nonBillableHours: orderItem.NoOfHrsPerMonth__c || 160,
                milestoneLineItemAmount: orderItem.MilestoneLineItemAmount__c,
                orderItemStartDate: orderItem.ServiceDate,
                orderItemEndDate: orderItem.EndDate,
                Amount: 0
              };
            })
          };
        });
        this.addActualAmountData();
        this.calculateAmounts();
        console.log("gridData wired 236===>" + JSON.stringify(this.gridData));
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }

  connectedCallback() {
    loadStyle(this, COLORS)
      .then(() => {
        console.log("Loaded Successfully");
      })
      .catch(() => {
        console.log("Error in loading the colors");
      });
    // let year = new Date().getFullYear(); //01
    let year = 2020; //02
    for (let i = year; i < year + 12; i++) {
      //12
      this.financialYearOptions.push({
        label: `${i}-${i + 1}`,
        value: `${i}-${i + 1}`
      });
    }
    // this.financialYear = this.financialYearOptions[0].value;
  }

  handleYearChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    if (name === "financialYear") {
      this.financialYear = value;
      let [startYear, endYear] = this.financialYear.split("-").map(Number);
      this.startDate = `04/01/${startYear}`;
      this.endDate = `03/31/${endYear}`;
    } else if (name === "businessDivision") {
      this.bDivision = value;
      console.log("businessDivision", value);
    } else if (name === "currency") {
      this.currencyValue = value;
      console.log("currency", value);
    } else if (name === "currencyConvert") {
      this.isCurrencyEnable = !this.isCurrencyEnable;
      if (!this.isCurrencyEnable) this.currencyValue = null;
    }
  }

  calculateAmounts() {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    let array = ["Actual", "NonBillable", "Total"];
    let startMonth = 3; // April

    let overallTotalHours = 0;
    let overallTotalAmount = 0;
    let monthlyTotals = {};

    this.gridData?.forEach((parent) => {
      let totalAmount = 0;
      let totalHours = 0;
      let engagementModel = parent.engagementModel;
      let monthlyAmounts = {};

      parent?._children?.forEach((child) => {
        child.currencyIsoCode = this.isCurrencyEnable ? parent.currencyIsoCode : "USD";
        let recSD = child.orderItemStartDate;
        let recED = child.orderItemEndDate;
        for (let i = 0; i < 12; i++) {
          let sD = new Date(recSD + " 00:00:00"); // orderItem startDate
          let eD = new Date(recED + " 00:00:00"); // orderItem endDate
          let currentMonth = (startMonth + i) % 12; // april, may ......
          let arr = [0, 1, 2]; // jan, feb, march
          let y2 = arr.includes(currentMonth)
            ? new Date(this.endDate).getFullYear()
            : new Date(this.startDate).getFullYear();
          let startDateTORefer = new Date(
            currentMonth + 1 + "/" + sD.getDate() + "/" + y2 + " 00:00:00"
          ); 
          let endDateTORefer = new Date(
            currentMonth + 1 + "/" + eD.getDate() + "/" + y2 + " 00:00:00"
          );

          let nonBillableMonth = months[currentMonth] + "NonBillable";
          let actualMonth = months[currentMonth] + "Actual";
          let totalMonth = months[currentMonth] + "Total";

          if (child[actualMonth] === 0 || !child[actualMonth]) {
            if (engagementModel === "Time & Material") {
              if (startDateTORefer >= sD && endDateTORefer <= eD) {
                child[months[currentMonth] + "NonBillable"] = child.nonBillableRate * child.nonBillableHours;
              } else {
                child[months[currentMonth] + "NonBillable"] =   0.0;
              }
            } else if (engagementModel === "Milestone") {
              if (endDateTORefer.getTime() === eD.getTime()) {
                child[months[currentMonth] + "NonBillable"] =
                 child.milestoneLineItemAmount ||  + child.nonBillableRate;
              } else {
                child[months[currentMonth] + "NonBillable"] =   0.0;
              }
            } else {
              child[months[currentMonth] + "NonBillable"] =    0.0;
            }
          }
          child[totalMonth] = child[actualMonth] + child[nonBillableMonth];
        }

        child.Amount = Object.keys(child)
          .filter(
            (key) =>
              months.includes(key.substring(0, 3)) &&
              key.substring(3) !== "Total"
          )
          .reduce((sum, key) => sum + child[key], 0);
        console.log(JSON.stringify(Object.keys(child)));
        totalAmount += child.Amount;
        totalHours += child.nonBillableHours;

        for (let i = 0; i < 12; i++) {
          let currentMonth = (startMonth + i) % 12;
          let month = months[currentMonth];

          if (!monthlyAmounts[month + "NonBillable"]) {
            monthlyAmounts[month + "NonBillable"] = 0.0;
          }
          monthlyAmounts[month + "NonBillable"] += child[month + "NonBillable"];

          if (!monthlyAmounts[month + "Actual"]) {
            monthlyAmounts[month + "Actual"] = 0.0;
          }
          monthlyAmounts[month + "Actual"] += child[month + "Actual"];

          if (!monthlyAmounts[month + "Total"]) {
            monthlyAmounts[month + "Total"] = 0.0;
          }
          monthlyAmounts[month + "Total"] += child[month + "Total"];
        }
      });

      parent.Amount = totalAmount;
      parent.nonBillableHours = totalHours;

      for (let i = 0; i < 12; i++) {
        let currentMonth = (startMonth + i) % 12;
        for (let j = 0; j < array.length; j++) {
          let monthName = months[currentMonth] + array[j];
          parent[monthName] = monthlyAmounts[monthName]
            ? monthlyAmounts[monthName]
            : 0.0;
        }
      }

      overallTotalHours += totalHours;
      overallTotalAmount += totalAmount;

      for (let i = 0; i < 12; i++) {
        let currentMonth = (startMonth + i) % 12;
        for (let j = 0; j < array.length; j++) {
          let monthName = months[currentMonth] + array[j];
          if (!monthlyTotals[monthName]) {
            monthlyTotals[monthName] = 0.0;
          }
          monthlyTotals[monthName] += monthlyAmounts[monthName];
        }
      }
    });

    let totalRow = {
      projectName: "Total",
      billingRole: "",
      rate: "",
      hours: overallTotalHours,
      Amount: overallTotalAmount,
      boldStyle: "bold-text",
      currencyIsoCode: this.currencyValue
    };

    for (let i = 0; i < 12; i++) {
      let currentMonth = (startMonth + i) % 12;
      for (let j = 0; j < array.length; j++) {
        let monthName = months[currentMonth] + array[j];
        totalRow[monthName] = monthlyTotals[monthName];
      }
    }

    this.gridData = [
      ...this.gridData.filter((row) => row.name !== "Total"),
      totalRow
    ];

    this.totalHours = overallTotalHours;
    this.totalAmount = overallTotalAmount;

    this.gridData = [...this.gridData];
  }

  addActualAmountData() {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    this.gridData.forEach((order) => {
      if (order._children) {
        order._children?.forEach((orderItem) => {
          this.rawQuoteData.forEach((quote) => {
            quote.QuoteLineItems.forEach((quoteItem) => {
              if (quoteItem.Project_Line_Item__c === orderItem.id) {
                orderItem[quote.Invoice_date_Month__c.substring(0, 3) + "Actual"] = this.isCurrencyEnable ?  quoteItem.Sales_Rate__c * quoteItem.totalBillablehours__c : quoteItem.SalesRateConverted__c * quoteItem.totalBillablehours__c;
                orderItem[quote.Invoice_date_Month__c.substring(0, 3) + "NonBillable"] = 0.0;
              }
            });
          });
        });
        order._children?.forEach((orderItem) => {
          for (let i = 0; i < 12; i++) {
            if (!orderItem[months[i] + "Actual"]) {
              orderItem[months[i] + "Actual"] = 0.0;
            }
          }
        });
      }
    });
  }
}