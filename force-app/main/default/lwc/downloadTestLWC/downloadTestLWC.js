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

  convertToCSV(data) {
    let csvContent = [];
// const topHeaders = [
//     "",
//     "", 
//     "", 
//     "", 
//     "", 
//     "", 
//     "", "April", "",
//     "", "May", "",
//     "", "June", "",
//     "", "July", "",
//     "", "August", "",
//     "", "September", "",
//     "", "October", "",
//     "", "November", "",
//     "", "December", "",
//     "", "January", "",
//     "", "February", "",
//     "", "March", "",
//     ""
// ];
// csvContent.push(topHeaders.join(","));

const headers = [
    "Project Name",
    "Client Name",
    "Business Division",
    "Contract Number",
    "Contract End Date",
    "Billing Role",
    "April Actual", "April Unbilled", "April Total",
    "May Actual", "May Unbilled", "May Total",
    "June Actual", "June Unbilled", "June Total",
    "July Actual", "July Unbilled", "July Total",
    "August Actual", "August Unbilled", "August Total",
    "September Actual", "September Unbilled", "September Total",
    "October Actual", "October Unbilled", "October Total",
    "November Actual", "November Unbilled", "November Total",
    "December Actual", "December Unbilled", "December Total",
    "January Actual", "January Unbilled", "January Total",
    "February Actual", "February Unbilled", "February Total",
    "March Actual", "March Unbilled", "March Total",
    "Amount"
];
csvContent.push(headers.join(",") + "\n");
console.log('csvContent==>',csvContent)

    this.gridData.forEach(parent => {
        const parentRow = [
            parent.projectName || '',
            parent.accountName || '',
            parent.businessDivision || '',
            parent.contractNumber || '',
            parent.contractEndDate || '',
            parent.billingRole || '',
            parent.AprActual || 0, parent.AprNonBillable || 0, parent.AprTotal || 0,
            parent.MayActual || 0, parent.MayNonBillable || 0, parent.MayTotal || 0,
            parent.JunActual || 0,  parent.JunNonBillable || 0, parent.JunTotal || 0, 
            parent.JulActual || 0,  parent.JulNonBillable || 0, parent.JulTotal || 0, 
            parent.AugActual || 0,  parent.AugNonBillable || 0, parent.AugTotal || 0, 
            parent.SepActual || 0,  parent.SepNonBillable || 0, parent.SepTotal || 0, 
            parent.OctActual || 0,  parent.OctNonBillable || 0, parent.OctTotal || 0, 
            parent.NovActual || 0,  parent.NovNonBillable || 0, parent.NovTotal || 0, 
            parent.DecActual || 0,  parent.DecNonBillable || 0, parent.DecTotal || 0, 
            parent.JanActual || 0,  parent.JanNonBillable || 0, parent.JanTotal || 0, 
            parent.FebActual || 0,  parent.FebNonBillable || 0, parent.FebTotal || 0, 
            parent.MarActual || 0,  parent.MarNonBillable || 0, parent.MarTotal || 0, 
            parent.Amount || 0
        ].map(value => `"${value}"`).join(",");

        csvContent += parentRow + "\n";
        // csvContent += parentRow.join(",") + "\n";
        console.log('csvContent parent==>',csvContent)
        parent._children?.forEach(child => {
            const childRow = [
                parent.projectName || '',
                parent.accountName || '',
                parent.businessDivision || '',
                parent.contractNumber || '',
                parent.contractEndDate || '',
                child.billingRole || '',
                child.AprActual || 0, child.AprNonBillable || 0, child.AprTotal || 0,
                child.MayActual || 0, child.MayNonBillable || 0, child.MayTotal || 0,
                child.JunActual || 0,  child.JunNonBillable || 0, child.JunTotal || 0, 
                child.JulActual || 0,  child.JulNonBillable || 0, child.JulTotal || 0, 
                child.AugActual || 0,  child.AugNonBillable || 0, child.AugTotal || 0, 
                child.SepActual || 0,  child.SepNonBillable || 0, child.SepTotal || 0, 
                child.OctActual || 0,  child.OctNonBillable || 0, child.OctTotal || 0, 
                child.NovActual || 0,  child.NovNonBillable || 0, child.NovTotal || 0, 
                child.DecActual || 0,  child.DecNonBillable || 0, child.DecTotal || 0, 
                child.JanActual || 0,  child.JanNonBillable || 0, child.JanTotal || 0, 
                child.FebActual || 0,  child.FebNonBillable || 0, child.FebTotal || 0, 
                child.MarActual || 0,  child.MarNonBillable || 0, child.MarTotal || 0, 
                child.Amount || 0
            ].map(value => `"${value}"`).join(",");

            csvContent += childRow + "\n";
            // csvContent += childRow.join(",") + "\n";
        });
    });
    console.log('csvContent child===>',csvContent)
    return csvContent;
}

handleDownload() {
    const csvContent = this.convertToCSV(this.gridData);

    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "filename.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // this.downloadCSV(csvContent, 'Invoice_Summary.csv');
    // console.log('csvContent',csvContent);
    // let encodedUri = encodeURI(csvContent);
    // console.log('encodedUri',encodedUri);
    // let link = document.createElement("a");
    // console.log('link',link);
    // link.setAttribute("href", encodedUri);
    // console.log('link.setAttribute',link.setAttribute);
    // link.setAttribute("download", "invoice_data.csv");
    // console.log('link.setAttribute',link.setAttribute);
    // document.body.appendChild(link);
    // console.log('document.body',document.body);

    // link.click(); 
    // console.log('link',link);
}
}