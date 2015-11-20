using System;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.Owin.Hosting;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

namespace HouseOfTheFuture.Api.IntegrationTests
{
    [TestClass]
    public class BaseIntegrationTest
    {
        private const string BaseAddress = "http://localhost:9000/";
        private Startup _startup;
        private IDisposable _webApp;
        
        [TestInitialize]
        public void TestInitialize()
        {
            _startup = new Startup();
            _webApp = WebApp.Start(BaseAddress, _startup.Configuration);
        }

        protected async Task<TResponse> Post<TRequest, TResponse>(string url, TRequest request)
        {
            var client = new HttpClient();
            var response = await client.PostAsync(BaseAddress + url, new ObjectContent<TRequest>(request, new JsonMediaTypeFormatter()));
            if (!response.IsSuccessStatusCode)
            {
                throw new HttpResponseException(response);
            }
            var textResponse = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<TResponse>(textResponse);
        }

        [TestCleanup]
        public void TestCleanup()
        {
            _webApp.Dispose();
        }
    }
}