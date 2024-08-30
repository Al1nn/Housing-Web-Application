using System;

namespace WebAPI.XMLModels
{
    // NOTE: Generated code may require at least .NET Framework 4.5 or .NET Core/Standard 2.0.
    /// <remarks/>
    [Serializable()]
    [System.ComponentModel.DesignerCategory("code")]
    [System.Xml.Serialization.XmlType(AnonymousType = true, Namespace = "http://www.bnr.ro/xsd")]
    [System.Xml.Serialization.XmlRoot(Namespace = "http://www.bnr.ro/xsd", IsNullable = false)]
    public partial class DataSet
    {

        private DataSetHeader headerField;

        private DataSetBody bodyField;

        /// <remarks/>
        public DataSetHeader Header
        {
            get
            {
                return headerField;
            }
            set
            {
                headerField = value;
            }
        }

        /// <remarks/>
        public DataSetBody Body
        {
            get
            {
                return bodyField;
            }
            set
            {
                bodyField = value;
            }
        }
    }

    /// <remarks/>
    [Serializable()]
    [System.ComponentModel.DesignerCategory("code")]
    [System.Xml.Serialization.XmlType(AnonymousType = true, Namespace = "http://www.bnr.ro/xsd")]
    public partial class DataSetHeader
    {

        private string publisherField;

        private DateTime publishingDateField;

        private string messageTypeField;

        /// <remarks/>
        public string Publisher
        {
            get
            {
                return publisherField;
            }
            set
            {
                publisherField = value;
            }
        }

        /// <remarks/>
        [System.Xml.Serialization.XmlElement(DataType = "date")]
        public DateTime PublishingDate
        {
            get
            {
                return publishingDateField;
            }
            set
            {
                publishingDateField = value;
            }
        }

        /// <remarks/>
        public string MessageType
        {
            get
            {
                return messageTypeField;
            }
            set
            {
                messageTypeField = value;
            }
        }
    }

    /// <remarks/>
    [Serializable()]
    [System.ComponentModel.DesignerCategory("code")]
    [System.Xml.Serialization.XmlType(AnonymousType = true, Namespace = "http://www.bnr.ro/xsd")]
    public partial class DataSetBody
    {

        private string subjectField;

        private string origCurrencyField;

        private DataSetBodyCube cubeField;

        /// <remarks/>
        public string Subject
        {
            get
            {
                return subjectField;
            }
            set
            {
                subjectField = value;
            }
        }

        /// <remarks/>
        public string OrigCurrency
        {
            get
            {
                return origCurrencyField;
            }
            set
            {
                origCurrencyField = value;
            }
        }

        /// <remarks/>
        public DataSetBodyCube Cube
        {
            get
            {
                return cubeField;
            }
            set
            {
                cubeField = value;
            }
        }
    }

    /// <remarks/>
    [Serializable()]
    [System.ComponentModel.DesignerCategory("code")]
    [System.Xml.Serialization.XmlType(AnonymousType = true, Namespace = "http://www.bnr.ro/xsd")]
    public partial class DataSetBodyCube
    {

        private DataSetBodyCubeRate[] rateField;

        private DateTime dateField;

        /// <remarks/>
        [System.Xml.Serialization.XmlElement("Rate")]
        public DataSetBodyCubeRate[] Rate
        {
            get
            {
                return rateField;
            }
            set
            {
                rateField = value;
            }
        }

        /// <remarks/>
        [System.Xml.Serialization.XmlAttribute(DataType = "date")]
        public DateTime date
        {
            get
            {
                return dateField;
            }
            set
            {
                dateField = value;
            }
        }
    }

    /// <remarks/>
    [Serializable()]
    [System.ComponentModel.DesignerCategory("code")]
    [System.Xml.Serialization.XmlType(AnonymousType = true, Namespace = "http://www.bnr.ro/xsd")]
    public partial class DataSetBodyCubeRate
    {

        private string currencyField;

        private byte multiplierField;

        private bool multiplierFieldSpecified;

        private decimal valueField;

        /// <remarks/>
        [System.Xml.Serialization.XmlAttribute()]
        public string currency
        {
            get
            {
                return currencyField;
            }
            set
            {
                currencyField = value;
            }
        }

        /// <remarks/>
        [System.Xml.Serialization.XmlAttribute()]
        public byte multiplier
        {
            get
            {
                return multiplierField;
            }
            set
            {
                multiplierField = value;
            }
        }

        /// <remarks/>
        [System.Xml.Serialization.XmlIgnore()]
        public bool multiplierSpecified
        {
            get
            {
                return multiplierFieldSpecified;
            }
            set
            {
                multiplierFieldSpecified = value;
            }
        }

        /// <remarks/>
        [System.Xml.Serialization.XmlText()]
        public decimal Value
        {
            get
            {
                return valueField;
            }
            set
            {
                valueField = value;
            }
        }
    }



}

